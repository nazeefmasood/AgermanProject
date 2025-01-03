// import React from 'react'
// import { StyleSheet,  View, Image, TouchableOpacity, ScrollView } from 'react-native'
// import { Card, Text, Title, DataTable, Button, Divider } from 'react-native-paper';
// import { useAuth, useUser } from '@clerk/clerk-expo'
// import { router } from 'expo-router';
// import { Redirect } from 'expo-router';

// export default AdminDashboard = () => {
//     const {user}=useUser();
//     const { signOut } = useAuth()
//     const { isSignedIn } = useAuth();
  
//     console.log(isSignedIn);
    
  
//     const doLogout = async() => {
      
//       await signOut()
//       // router.replace("/public/Login");
//       console.log("User logged out");
//     };
//       return (
//     <ScrollView>
// <View style={{ padding: 20 }}>
//   <Title>Hello Admin,<Title style={{fontWeight:'bold',color:'#000'}}>{user?.fullName.toLocaleUpperCase()}</Title></Title>
//   <Divider bold={true}  />
//   {/* <Title style={{fontWeight:'bold',color:'green'}}>Registered Companies</Title> */}
//   <Divider />
//   </View>
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.menuBox} onPress={()=>router.push('/Users' )}>
//       <Image
//   style={styles.icon}
//   source={{ uri: 'https://img.icons8.com/?size=100&id=psevkzUhHRTs&format=png&color=000000' }}
//   defaultSource={require('../../assets/images/logo.jpg')}
// />
//         <Text style={styles.info}>Manage Users</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.menuBox} onPress={()=>router.push('/ManageMovers')}>
//         <Image
//           style={styles.icon}
//           source={{ uri: 'https://img.icons8.com/color/70/000000/administrator-male.png' }}
//         />
//         <Text style={styles.info}>Manage Movers</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.menuBox} onPress={()=>router.push('OrderStats' )}>
//         <Image
//           style={styles.icon}
//           source={{ uri: 'https://img.icons8.com/color/70/000000/pie-chart.png' }}
//         />
//         <Text style={styles.info}>Stats</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.menuBox}  onPress={()=>router.push('ShowTransactions' )}>
//         <Image
//           style={styles.icon}
//           source={{ uri: 'https://img.icons8.com/?size=100&id=Tys9Kx3DE6tD&format=png&color=000000' }}
//         />
//         <Text style={styles.info}>Transactions
//         </Text>
//       </TouchableOpacity>


//       <TouchableOpacity style={styles.menuBox}>
//         <Image
//           style={styles.icon}
//           source={{ uri: 'https://img.icons8.com/color/70/000000/user.png' }}
//         />
//         <Text style={styles.info}>Profile</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.menuBox} onPress={doLogout}>
//         <Image
//           style={styles.icon}
//           source={{ uri: 'https://img.icons8.com/?size=100&id=8119&format=png&color=ffffff' }}
//         />
//         <Text style={styles.info}>Log Out</Text>
//       </TouchableOpacity>
//     </View>
//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 40,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   menuBox: {
//     // backgroundColor: '#DCDCDC',
//     backgroundColor: '#030d1c',
//     borderRadius:20,
//     width: 180,
//     height: 200,
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: 12,
//     shadowColor: '#000',
//       shadowOpacity: 0.5,
//       shadowOffset: { width: 1, height: 2 },
//   },
//   icon1: {
//     width: 60,
//     height: 60,
//     padding:40,
//     marginBottom:20,
//   },
//   icon: {
//     width: 100,
//     height: 10,
//     padding:40,
//     marginBottom:20,
    
//   },
//   info: {

//     fontSize: 22,
//     fontWeight:'bold',
//     // color: '#696969',
//     color:"#fff",
//   },
// })

import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Title, Divider } from 'react-native-paper';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  withSpring,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MenuCard = ({ icon, title, onPress, index }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }]
  }));

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      style={[styles.cardContainer]}
    >
      <TouchableOpacity
        onPressIn={() => scale.value = 0.95}
        onPressOut={() => scale.value = 1}
        onPress={onPress}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <LinearGradient
            colors={['#1e293b', '#334155']}
            style={styles.gradientBg}
          >
            {icon}
            <Text style={styles.cardTitle}>{title}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AdminDashboard = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const headerAnimation = useSharedValue(0);

  useEffect(() => {
    headerAnimation.value = withSpring(1);
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerAnimation.value }],
    opacity: headerAnimation.value,
  }));

  const menuItems = [
    {
      title: 'Manage Users',
      icon: <MaterialIcons name="group" size={32} color="#fff" />,
      onPress: () => router.push('/Users'),
    },
    {
      title: 'Manage Movers',
      icon: <MaterialIcons name="local-shipping" size={32} color="#fff" />,
      onPress: () => router.push('/ManageMovers'),
    },
    {
      title: 'Statistics',
      icon: <Ionicons name="stats-chart" size={32} color="#fff" />,
      onPress: () => router.push('OrderStats'),
    },
    {
      title: 'Transactions',
      icon: <MaterialIcons name="payment" size={32} color="#fff" />,
      onPress: () => router.push('ShowTransactions'),
    },
    {
      title: 'Profile',
      icon: <MaterialIcons name="person" size={32} color="#fff" />,
      onPress: () => router.push('/Profile'),
    },
    {
      title: 'Logout',
      icon: <MaterialIcons name="logout" size={32} color="#fff" />,
      onPress: signOut,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <LinearGradient
          colors={['#0f172a', '#1e293b']}
          style={styles.headerGradient}
        >
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Title style={styles.userName}>{user?.fullName?.toUpperCase()}</Title>
        </LinearGradient>
      </Animated.View>

      <Animated.View 
        entering={FadeInRight.springify()}
        style={styles.statsContainer}
      >
        <Text style={styles.statsTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{22}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>56</Text>
            <Text style={styles.statLabel}>Active Movers</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <MenuCard
            key={index}
            icon={item.icon}
            title={item.title}
            onPress={item.onPress}
            index={index}
          />
        ))}
      </View>
    </ScrollView>
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
  welcomeText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    width: width * 0.43,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLabel: {
    color: '#64748b',
    marginTop: 5,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: width * 0.44,
    marginBottom: 15,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientBg: {
    padding: 20,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  
});

export default AdminDashboard;