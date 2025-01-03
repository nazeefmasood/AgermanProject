// import React, { useEffect,useRef,useState } from 'react'
// import { View,ScrollView,FlatList,Image ,StyleSheet, Pressable, TouchableOpacity} from 'react-native'
// import { useUser } from '@clerk/clerk-expo'
// import { getDocs,collection } from 'firebase/firestore';
// import DB from '../../database/firebaseConfig';
// import { Card, Text, Title, DataTable, Button, Divider } from 'react-native-paper';
// import { router } from 'expo-router';
// import * as Notifications from 'expo-notifications';
// import { MaterialIcons } from '@expo/vector-icons';
// import NotificationScreen from '../../app/(users)/(tabs)/NotificationScreen';

// const User = () => {

// const {user}=useUser()

// const [companies, setCompanies] = useState([]);
// const [orderHistory, setOrderHistory] = useState([]);

// const fetchCompanies = async () => {
//     try {
    
//       const querySnapshot = await getDocs(collection(DB,"companies")); 

// const companyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// console.log("Company Data: ", companyData);
// setCompanies(companyData);
//     } catch (error) {
//       console.error("Error fetching companies: ", error);
//     }
//   };
  
//   Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowAlert: true,
//       shouldPlaySound: true,
//       shouldSetBadge: true,
//     }),
//   });
//   useEffect(() => {
//     // Handle notifications when app is foregrounded
//     const subscription = Notifications.addNotificationReceivedListener(notification => {
//         console.log('Notification received:', notification);
//         // You can add custom handling here
//     });

//     // Handle notifications when app is in background
//     const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
//         console.log('Background notification:', response);
//         // You can add navigation to order details here
//     });

//     return () => {
//         subscription.remove();
//         backgroundSubscription.remove();
//     };
// }, []);

// const fetchOrders = async () => {
//   try {
  
//     const querySnapshot = await getDocs(collection(DB,"furnitureOrders")); 

// const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// console.log("Orders Data: ", ordersData);
// setOrderHistory(ordersData);
//   } catch (error) {
//     console.error("Error fetching companies: ", error);
//   }
// };
// useEffect(() => {
//   // Dummy data for companies
 
//   fetchCompanies();
//   fetchOrders();
//   // Dummy data for order history
//   // const dummyOrders = [
//   //   { id: '1001', date: '2023-01-01', status: 'Delivered'},
//   //   { id: '1002', date: '2023-01-05', status: 'Shipped' },
//   //   { id: '1003', date: '2023-01-10', status: 'Pending'},
//   // ];
//   // setOrderHistory(dummyOrders);
// }, []);

// const renderCompanyCard = ({ item }) => (
//     <Pressable >
    

//   <Card style={styles.card} onPress={()=>router.push({pathname:'CompanyDetails',params:{id:item.id}})}>
//     <Card.Content >
//     <Image  source={{uri:item.profileImage}} style={styles.logo} />
//       <Title>{item.companyName}</Title>
//       <Text>{item.summary}</Text>
//     </Card.Content>
//   </Card>
    
//     </Pressable>
// );

// const [isModalVisible, setModalVisible] = useState(false);

// const toggleModal = () => {
//   setModalVisible(!isModalVisible);
// };
//   return (

// <ScrollView>

// <View style={{ padding: 20 }}>
//   <Title>Hello, <Title style={{fontWeight:'bold',color:'green'}}>{user?.fullName}</Title></Title>
//   <Divider />
//   <FlatList
//     data={companies}
//     renderItem={renderCompanyCard}
//     keyExtractor={item => item.id}
//     horizontal
//     showsHorizontalScrollIndicator={false}
//     style={{ marginVertical: 20 }}
//   />


//   <Title>Previous Order History</Title>
//   <DataTable>
//     <DataTable.Header>
//       <DataTable.Title >Order ID</DataTable.Title>
//       <DataTable.Title>Date</DataTable.Title>
//       <DataTable.Title>Status</DataTable.Title>
//     </DataTable.Header>
//     {orderHistory.map(order => (
//       <DataTable.Row key={order.id}>
//         <DataTable.Cell>{order.id.slice(0,8)}..</DataTable.Cell>
//         <DataTable.Cell>{order.date.slice(0,10)}</DataTable.Cell>
//         <DataTable.Cell>{order.status}</DataTable.Cell>
//       </DataTable.Row>
//     ))}
//   </DataTable>
// </View>
// <View style={styles.iconContainer}>
// <TouchableOpacity onPress={toggleModal}  >

// <MaterialIcons name="notifications-on" size={24} color="green" />
// </TouchableOpacity>
// </View>

// <NotificationScreen isVisible={isModalVisible} onClose={toggleModal} />
// </ScrollView>
//   )
// }

// export default User

// const styles = StyleSheet.create({
//     card: {
//       margin: 10,
//       height: 210,
//       width: 170,
//       // overflow: 'hidden',
//     },
//     logo: {
//       width: 120,
//       height: 100,
//       alignSelf: 'center',
//       marginBottom: 10,
//     },
//     title: {
//       textAlign: 'center',
//       marginBottom: 10,
//     },
//     iconContainer: {
//       position: 'absolute',
//       bottom: 20, // Position 20px from the bottom
//       right: 20,  // Position 20px from the right
//       backgroundColor: 'white',
//       padding: 10,
//       borderRadius: 30, // Make it circular
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.2,
//       shadowRadius: 2,
//       elevation: 5, // For Android shadow
//     },
//   });

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { getDocs, collection } from 'firebase/firestore';
import DB from '../../database/firebaseConfig';
import { Text, Card, Button, DataTable, Avatar } from 'react-native-paper';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { MaterialIcons } from '@expo/vector-icons';
import NotificationScreen from '../../app/(users)/(tabs)/NotificationScreen';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const User = () => {
  const { user } = useUser();
  const [companies, setCompanies] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  // Notification setup
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const fetchCompanies = async () => {
    try {
      const querySnapshot = await getDocs(collection(DB, "companies"));
      const companyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompanies(companyData);
    } catch (error) {
      console.error("Error fetching companies: ", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(DB, "furnitureOrders"));
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrderHistory(ordersData);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchOrders();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Background notification:', response);
    });

    return () => {
      subscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#2196F3';
      case 'pending': return '#FFC107';
      default: return '#757575';
    }
  };

  const CompanyCard = ({ item, onPress }) => {
    const rating = item.rating || 4.5; // Fallback rating if not provided
    const isVerified = item.isVerified || true; // Assuming company verification status
    
    return (
      <TouchableOpacity 
         onPress={()=>router.push({pathname:'CompanyDetails',params:{id:item.id}})}
        style={styles.Companycontainer}
        activeOpacity={0.9}
      >
        <Card style={styles.card}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.profileImage }} 
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            />
            {isVerified && (
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" size={20} color="#2196F3" />
              </View>
            )}
          </View>
  
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.companyName} numberOfLines={1}>
                {item.companyName}
              </Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color="#FFC107" />
                <Text style={styles.ratingText}>{rating}</Text>
              </View>
            </View>
  
            <Text style={styles.summary} numberOfLines={2}>
              {item.summary}
            </Text>
  
            <View style={styles.footer}>
              <View style={styles.tagContainer}>
                {item.tags?.slice(0, 2).map((tag, index) => (
                  <Badge
                    key={index}
                    style={styles.tag}
                    size={20}
                  >
                    {tag}
                  </Badge>
                ))}
              </View>
              <View style={styles.detailsButton}>
                <Text style={styles.detailsText}>View Details</Text>
                <MaterialIcons name="arrow-forward-ios" size={14} color="#2196F3" />
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.fullName}</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.notificationButton}>
          <MaterialIcons name="notifications-none" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Companies</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.companiesContainer}
        >
          {companies.map((item) => (
            <CompanyCard key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <Card style={styles.ordersCard}>
          {orderHistory.slice(0, 5).map((order) => (
            <View key={order.id} style={styles.orderItem}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>
                <Text style={styles.orderDate}>{order.date.slice(0, 10)}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>
          ))}
          {orderHistory.length > 5 && (
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Orders</Text>
            </TouchableOpacity>
          )}
        </Card>
      </View>

      <NotificationScreen isVisible={isModalVisible} onClose={() => setModalVisible(false)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',

    paddingTop:20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  companiesContainer: {
    paddingRight: 20,
  },
  companyCardContainer: {
    height:200,
    marginRight: 15,
  },
  companyCard: {
    width: width * 0.7,
    height: 200,
    overflow: 'hidden',
    borderRadius: 15,
  },
  companyImage: {
    width: 100,
    height: 100,
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'flex-end',
  },
  companyName: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  companySummary: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  ordersCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewAllButton: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  viewAllText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  Companycontainer: {
    marginRight: 15,
    marginBottom: 10,
    width: width * 0.75,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  contentContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E3F2FD',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  detailsText: {
    color: '#2196F3',
    marginRight: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default User;