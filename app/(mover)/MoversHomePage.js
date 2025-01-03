import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { Card, Text, Button, Avatar, Surface, useTheme, IconButton } from 'react-native-paper';
import { collection, query, where, getDocs } from 'firebase/firestore';
import DB from '../../database/firebaseConfig';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { MaterialCommunityIcons,Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={"#000"} />
    </Pressable>
  );
};
const Dashboard = () => {
  const [moverData, setMoverData] = useState(null);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [stats, setStats] = useState({
    completedJobs: 0,
    pendingJobs: 0,
    totalEarnings: 0,
    avgRating: 0,
  });
  const [feedback, setFeedback] = useState([]);
  const { user } = useUser();
  const theme = useTheme();

  useEffect(() => {
    fetchMoverData();
  }, []);

  const fetchMoverData = async () => {
    if (user) {
      try {
        // Fetch mover data
        const q = query(collection(DB, "companies"), where("username", "==", user?.username));
        const querySnapshot = await getDocs(q);
        const moverData = [];
        let moverId; 
        querySnapshot.forEach((doc) => {
          moverId = doc.id;
          moverData.push({ id: doc.id, ...doc.data() });
        });

        if (moverData.length > 0) {
          setMoverData(moverData[0]);
          
          // Fetch jobs
          const jobsQuery = query(collection(DB, 'furnitureOrders'), where('moverId', '==', moverId));
          const jobsSnapshot = await getDocs(jobsQuery);
          const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAssignedJobs(jobs);

          // Calculate stats
          const completed = jobs.filter(job => job.status === 'completed').length;
          const pending = jobs.filter(job => job.status === 'pending').length;
         

          // Fetch feedback
          const feedbackQuery = query(collection(DB, 'feedback'), where('companyId', '==', moverId));
          const feedbackSnapshot = await getDocs(feedbackQuery);
          const feedbackData = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const avgRating = feedbackData.reduce((total, fb) => total + fb.rating, 0) / feedbackData.length;
          const earnings = assignedJobs.reduce((total, job) => {
            return total + parseFloat(job?.paymentInfo?.paidAmount || 0); 
        }, 0);
          setStats({
            completedJobs: completed,
            pendingJobs: pending,
            totalEarnings: earnings,
            avgRating: avgRating || 0,
          });
          setFeedback(feedbackData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const renderStatsCard = (icon, title, value, color) => (
    <Surface style={[styles.statCard, { backgroundColor: color }]} elevation={2}>
      <MaterialCommunityIcons name={icon} size={24} color="white" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Surface>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Surface style={styles.header} elevation={2}>
      <View style={{justifyContent:'space-between'}}>

        <View style={styles.profileSection}>
        <TouchableOpacity onPress={()=>router.push('/MoverProfile')}>

          <Avatar.Image 
            size={80} 
            source={{ uri: moverData?.profileImage|| 'https://via.placeholder.com/80' }} 
          />
        </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.companyName}>{moverData?.companyName}</Text>
            <Text style={styles.subText}>{moverData?.email}</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <MaterialCommunityIcons
                  key={star}
                  name={star <= stats.avgRating ? "star" : "star-outline"}
                  size={20}
                  color="#FFD700"
                />
              ))}
            </View>
          </View>
        </View>
        <View>
          <LogoutButton />
        </View>
      </View>
      </Surface>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {renderStatsCard("truck-fast", "Pending Jobs", stats.pendingJobs, "#FF6B6B")}
        {renderStatsCard("check-circle", "Completed", stats.completedJobs, "#4ECDC4")}
        {renderStatsCard("credit-card", "Earnings", `PKR${stats.totalEarnings}`, "#45B7D1")}
        {renderStatsCard("star", "Rating", stats.avgRating.toFixed(1), "#96CEB4")}
      </View>

      {/* Recent Orders */}
      <Text style={styles.sectionTitle}>Recent Orders</Text>
      {assignedJobs.slice(0, 3).map((job) => (
        <Card key={job.id} style={styles.orderCard} onPress={() => router.push(`JobDetails?jobId=${job.id}`)}>
          <Card.Content>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderTitle}>{job.orderName}</Text>
                <Text style={styles.orderDate}>{job.date} • {job.time}</Text>
              </View>
              <Surface style={[styles.statusBadge, 
                { backgroundColor: job.status === 'completed' ? '#4ECDC4' : '#FFD93D' }]}>
                <Text style={styles.statusText}>{job.status}</Text>
              </Surface>
            </View>
            <View style={styles.orderDetails}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
              <Text style={styles.orderLocation}>{job.pickupAddress}</Text>
            </View>
          </Card.Content>
        </Card>
      ))}

      {/* Recent Feedback */}
      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>Recent Feedback</Text>
        {feedback.slice(0, 3).map((fb) => (
          <Surface key={fb.id} style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <MaterialCommunityIcons
                    key={star}
                    name={star <= fb.rating ? "star" : "star-outline"}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.feedbackDate}>{new Date(fb.timestamp).toLocaleDateString()}</Text>
            </View>
            <Text style={{color:'blue'}}>{fb.email}</Text>
            <Text style={styles.feedbackText}>{fb.feedback}</Text>
          </Surface>
        ))}
      </View>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop:40
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    color: '#666',
    marginVertical: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 5,
  },
  statTitle: {
    color: 'white',
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  orderCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  orderLocation: {
    marginLeft: 5,
    color: '#666',
    flex: 1,
  },
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedbackDate: {
    color: '#666',
    fontSize: 12,
  },
  feedbackText: {
    color: '#444',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  actionButton: {
    flex: 0.45,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
});

export default Dashboard;