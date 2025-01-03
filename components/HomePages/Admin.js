import React, { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Title, Button, Card, Paragraph } from 'react-native-paper';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  withSpring,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const key = 'sk_test_CPes7EdioH5zt6FigGv5cN9hovQextyohqQam2xwAB';

const UserCard = ({ person, onDelete, onBan, index }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }]
  }));

  const renderRightActions = () => (
    <Animated.View 
      entering={FadeInRight.delay(100)}
      style={styles.actionContainer}
    >
      <LinearGradient
        colors={['#ef4444', '#dc2626']}
        style={styles.actionButton}
      >
        <TouchableOpacity onPress={() => onDelete(person.id)} style={styles.actionButtonContent}>
          <Ionicons name="trash" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const renderLeftActions = () => (
    <Animated.View 
      entering={FadeInRight.delay(100)}
      style={styles.actionContainer}
    >
      <LinearGradient
        colors={['#f97316', '#ea580c']}
        style={styles.actionButton}
      >
        <TouchableOpacity onPress={() => onBan(person.id)} style={styles.actionButtonContent}>
          <FontAwesome name="ban" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Ban</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <>
      {person.unsafe_metadata.role === 'user' && (
        <Animated.View
          entering={FadeInDown.delay(index * 100).springify()}
          style={[styles.cardContainer, animatedStyle]}
        >
          <Swipeable
            renderRightActions={renderRightActions}
            renderLeftActions={renderLeftActions}
          >
            <TouchableOpacity
              onPress={() => router.push({ pathname: '[userid]', params: { userId: person?.id }})}
              onPressIn={() => scale.value = 0.98}
              onPressOut={() => scale.value = 1}
            >
              <Card style={styles.card}>
                <LinearGradient
                  colors={['#ffffff', '#f8fafc']}
                  style={styles.cardGradient}
                >
                  <Card.Title
                    title={`${person.first_name} ${person.last_name}`}
                    subtitle={person.email_addresses[0]?.email_address}
                    titleStyle={styles.cardTitle}
                    subtitleStyle={styles.cardSubtitle}
                    left={() => (
                      <Image 
                        source={{ uri: person?.image_url || 'https://www.gravatar.com/avatar?d=mp' }} 
                        style={styles.avatar} 
                      />
                    )}
                  />
                  <Card.Content>
                    <View style={styles.infoContainer}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Created</Text>
                        <Text style={styles.infoValue}>
                          {new Date(person.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Last Active</Text>
                        <Text style={styles.infoValue}>
                          {new Date(person.last_active_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </LinearGradient>
              </Card>
            </TouchableOpacity>
          </Swipeable>
        </Animated.View>
      )}
    </>
  );
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const { user } = useUser();
  const headerAnimation = useSharedValue(0);

  useEffect(() => {
    headerAnimation.value = withSpring(1);
    fetchUsers();
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerAnimation.value }],
    opacity: headerAnimation.value,
  }));

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://api.clerk.dev/v1/users', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const banUser = async (userId) => {
    try {
      const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          private_metadata: { banned: true },
        }),
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <LinearGradient
          colors={['#0f172a', '#1e293b']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
          <View>
            <TouchableOpacity onPress={()=>router.back()}><Ionicons name='arrow-back-outline' color='white' size={36}/></TouchableOpacity>
          </View>
            <View>
              <Text style={styles.headerTitle}>Manage Users</Text>
              <Text style={styles.headerSubtitle}>
                {users.length} Total Users
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={() => router.push('/AddUser')}
              icon="plus"
              style={styles.addButton}
            >
              Add User
            </Button>
          </View>
        </LinearGradient>
      </Animated.View>

      <FlatList
        data={users}
        renderItem={({ item, index }) => (
          <UserCard
            person={item}
            onDelete={deleteUser}
            onBan={banUser}
            index={index}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingTop:20,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#3b82f6',
  },
  listContainer: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  cardSubtitle: {
    color: '#64748b',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 12,
  },
  infoValue: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
  },
  actionContainer: {
    width: 80,
    marginVertical: 8,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#3b82f6',
  },
  listContainer: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  cardSubtitle: {
    color: '#64748b',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 12,
  },
  infoValue: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
  },
  actionContainer: {
    width: 80,
    marginVertical: 8,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});

export default ManageUsers;