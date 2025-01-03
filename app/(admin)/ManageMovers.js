import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { Text, Title, Button, Card, Paragraph } from 'react-native-paper';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  withSpring,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { getDocs, collection } from "firebase/firestore";
import DB from "../../database/firebaseConfig";
import StarRating from "./Stars";

const { width } = Dimensions.get('window');

const MoverCard = ({ mover, onDelete, index }) => {
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
        <TouchableOpacity onPress={() => onDelete(mover.id)} style={styles.actionButtonContent}>
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
        colors={['#22c55e', '#16a34a']}
        style={styles.actionButton}
      >
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: "[userid]",
            params: { userId: mover?.id },
          })} 
          style={styles.actionButtonContent}
        >
          <MaterialIcons name="edit" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={[styles.cardContainer, animatedStyle]}
    >
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
      >
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "[userid]",
            params: { userId: mover?.id },
          })}
          onPressIn={() => scale.value = 0.98}
          onPressOut={() => scale.value = 1}
        >
          <Card style={styles.card}>
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              style={styles.cardGradient}
            >
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Image 
                    source={{ uri: mover.profileImage }} 
                    style={styles.companyLogo} 
                  />
                  <View style={styles.headerInfo}>
                    <Title style={styles.companyName}>{mover.companyName}</Title>
                    <StarRating moverRating={mover.rating} />
                  </View>
                </View>

                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="phone" size={20} color="#64748b" />
                    <Text style={styles.infoText}>{mover.phoneNumber}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="email" size={20} color="#64748b" />
                    <Text style={styles.infoText}>{mover.email}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="business" size={20} color="#64748b" />
                    <Text style={styles.infoText}>{mover.businessLicense}</Text>
                  </View>
                </View>

                <View style={styles.documentButtons}>
                  <TouchableOpacity 
                    style={styles.docButton}
                    onPress={() => Linking.openURL(mover.businessLicenseDoc)}
                  >
                    <MaterialIcons name="description" size={20} color="#fff" />
                    <Text style={styles.docButtonText}>License</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.docButton}
                    onPress={() => Linking.openURL(mover.insuranceDoc)}
                  >
                    <MaterialIcons name="security" size={20} color="#fff" />
                    <Text style={styles.docButtonText}>Insurance</Text>
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </LinearGradient>
          </Card>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
};

const ManageMovers = () => {
  const [movers, setMovers] = useState([]);
  const headerAnimation = useSharedValue(0);

  useEffect(() => {
    headerAnimation.value = withSpring(1);
    fetchMoversfromDB();
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerAnimation.value }],
    opacity: headerAnimation.value,
  }));

  const fetchMoversfromDB = async () => {
    try {
      const querySnapshot = await getDocs(collection(DB, "companies"));
      const moversData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovers(moversData);
    } catch (error) {
      console.error("Error fetching Movers:", error);
    }
  };

  const deleteMover = async (moverId) => {
    try {
      // Implement your delete logic here
      fetchMoversfromDB();
    } catch (error) {
      console.error("Error deleting Mover:", error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0f172a',
          },
          headerShown:false,
          headerTintColor: '#fff',
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={36} color="#fff" />
             
            </TouchableOpacity>
          ),
        }}
      />

      <Animated.View style={[styles.header, headerStyle]}>
        <LinearGradient
          colors={['#0f172a', '#1e293b']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
          <View>
          <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={36} color="#fff" />
             
            </TouchableOpacity>
          </View>
            <View>
              <Text style={styles.headerTitle}>Manage Movers</Text>
              <Text style={styles.headerSubtitle}>
                {movers.length} Active Movers
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={() => router.push('AddMover')}
              icon="plus"
              style={styles.addButton}
            >
              Add Mover
            </Button>
          </View>
        </LinearGradient>
      </Animated.View>

      <FlatList
        data={movers}
        renderItem={({ item, index }) => (
          <MoverCard
            mover={item}
            onDelete={deleteMover}
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
    paddingTop:25,
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
    elevation: 3,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  infoContainer: {
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#334155',
    fontSize: 14,
  },
  documentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  docButton: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
    justifyContent: 'center',
  },
  docButtonText: {
    color: '#fff',
    marginLeft: 8,
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

export default ManageMovers;