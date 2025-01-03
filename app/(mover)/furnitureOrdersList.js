import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Pressable
} from 'react-native';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { formatDistance } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DB from '../../database/firebaseConfig'
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'unpaid':
        return '#FEF3C7';
      case 'pending':
        return '#FEF3C7';
      case 'in-progress':
        return '#DBEAFE';
      case 'completed':
        return '#D1FAE5';
      case 'paid':
        return '#D1FAE5';
      default:
        return '#F3F4F6';
    }
  };

  const getTextColor = (status) => {
    switch (status.toLowerCase()) {
      case 'unpaid':
        return '#92400E';
      case 'pending':
        return '#92400E';
      case 'in-progress':
        return '#1E40AF';
      case 'completed':
        return '#065F46';
      case 'paid':
        return '#065F46';
      default:
        return '#374151';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor(status) }]}>
      <Text style={[styles.badgeText, { color: getTextColor(status) }]}>
        {status}
      </Text>
    </View>
  );
};

const OrderCard = ({ order }) => {
  const handleJobPress = (jobId) => {
    router.push(`JobDetails?jobId=${jobId}`);
  };
  return(
    <Pressable onPress={()=>handleJobPress(order.id)}>

  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.orderId}>{order.orderName}</Text>
      <StatusBadge status={order.status} />
    </View>

    <View style={styles.cardContent}>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="calendar" size={20} color="#6B7280" />
        <Text style={styles.infoText}>
          {formatDistance(new Date(order?.createdAt), new Date(), { addSuffix: true })}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="map-marker" size={20} color="#6B7280" />
        <View>
          <Text style={styles.infoText}>From: {order.pickupLocation.address}</Text>
          <Text style={styles.infoText}>To: {order.dropoffLocation.address}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="currency-usd" size={20} color="#6B7280" />
        <Text style={styles.infoText}>${order.paymentInfo.paidAmount}</Text>
        <StatusBadge status={order.paymentInfo.paymentStatus} />
      </View>

      <View style={styles.tagsContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{order.description || 0} items</Text>
        </View>
       
      </View>
    </View>
  </View>
    </Pressable>
);
}

const FurnitureOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [moverData, setMoverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [error, setError] = useState(null);
    const {user}=useUser()

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' }
  ];

  let moverId
  const fetchMoverData = async () => {
    if (user) {
      try {
        const q = query(collection(DB, "companies"), where("username", "==", user?.username));
        const querySnapshot = await getDocs(q);

        const moverData = [];
        querySnapshot.forEach((doc) => {
          // Append the document data to the moverData array
          moverData.push({ id: doc.id, ...doc.data() });
          console.log(doc.id, " => ", doc.data());
          
        });
        moverId=querySnapshot.docs[0].id
        if (moverData.length > 0) {
          // Assuming you only expect one matching document
          setMoverData(moverData[0]);
          console.log(querySnapshot.docs[0].id);
          
        } else {
          console.log('No matching company found');
        }

        await fetchOrders({activeFilter,moverId});
      } catch (error) {
        console.error('Error fetching mover data:', error);
      }
    }
  };
  const fetchOrders = async ({statusFilter,moverId}) => {
    try {
        console.log(moverId);
        console.log(statusFilter);
        
      setLoading(true);
      const ordersRef = collection(DB,'furnitureOrders');
      let q = query(
        ordersRef,
        where('moverId', '==', moverId)
        // orderBy('createdAt', 'desc')
      );
      if (activeFilter !== 'all') {
        q = query(ordersRef, where('status', '==', activeFilter),where("moverId", '==', moverId));
      }
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(ordersData);
      
      setOrders(ordersData);
    } catch (err) {
    //   setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchMoverData() 
  }, [activeFilter]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderOrder = ({ item }) => <OrderCard order={item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Furniture Orders</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filterOptions.map(filter => (
          <TouchableOpacity
            key={filter.value}
            onPress={() => setActiveFilter(filter.value)}
            style={[
              styles.filterButton,
              activeFilter === filter.value && styles.activeFilterButton
            ]}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter.value && styles.activeFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  filterContainer: {
    flexGrow: 0,
    paddingHorizontal: 12,
    marginBottom: 8,
    height:50
  },
  filterButton: {
    height:40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap:'wrap',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: '#6B7280',
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  urgentTag: {
    backgroundColor: '#FEE2E2',
  },
  urgentTagText: {
    color: '#991B1B',
  },
});

export default FurnitureOrdersScreen;