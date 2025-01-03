import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import DB from "../../../database/firebaseConfig";
import { ScrollView } from "react-native-gesture-handler";
import DriverMap from "../../../components/Orders/DriverMap";

const { width } = Dimensions.get("window");

const ImageCarousel = ({ images, onImageChange }) => {
  const [loading, setLoading] = useState(true);
  
  return (
    <View style={styles.imageSliderContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          onImageChange(index);
        }}
      >
        {images?.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            {loading && (
              <ActivityIndicator 
                size="large" 
                color="#2196F3" 
                style={styles.loader}
              />
            )}
            <Image
              source={{ uri }}
              style={styles.productImage}
              onLoad={() => setLoading(false)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const StatusChip = ({ status }) => {
  const getChipColor = () => {
    switch (status?.toLowerCase()) {
      case 'pending': return { bg: '#FFF3E0', text: '#FF9800' };
      case 'completed': return { bg: '#E8F5E9', text: '#4CAF50' };
      case 'cancelled': return { bg: '#FFEBEE', text: '#F44336' };
      default: return { bg: '#E3F2FD', text: '#2196F3' };
    }
  };

  const colors = getChipColor();
  
  return (
    <View style={[styles.chip, { backgroundColor: colors.bg }]}>
      <Text style={[styles.chipText, { color: colors.text }]}>
        {status || 'Unknown'}
      </Text>
    </View>
  );
};

const PaymentInfoCard = ({ payment }) => {
  if (!payment) return null;
  
  return (
    <View style={[styles.infoCard, styles.paymentCard]}>
      <View style={styles.paymentHeader}>
        <Ionicons name="card" size={24} color="#2196F3" />
        <Text style={styles.paymentTitle}>Payment Details</Text>
      </View>
      
      <View style={styles.paymentInfo}>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Amount Paid</Text>
          <Text style={styles.paymentValue}>PKR {payment.amount?.toFixed(2)}</Text>
        </View>
        
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Payment Date</Text>
          <Text style={styles.paymentValue}>
            {payment.timestamp?.toDate().toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Payment Status</Text>
          <View style={[styles.chip, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.chipText, { color: '#4CAF50' }]}>
              {payment.status}
            </Text>
          </View>
        </View>

        {payment.metadata && (
          <>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Distance</Text>
              <Text style={styles.paymentValue}>{payment.metadata.distance?.toFixed(2)} km</Text>
            </View>
            
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Duration</Text>
              <Text style={styles.paymentValue}>{payment.metadata.duration?.toFixed(2)} hrs</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};
const InfoCard = ({ title, content }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoContent}>{content}</Text>
  </View>
);

const ListingDetail = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { listingId } = useLocalSearchParams();

  useEffect(() => {
    fetchOrderDetails();
  }, [listingId]);

  const fetchOrderDetails = async () => {
    try {
      const docRef = doc(DB, "furnitureOrders", listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        if (docSnap.data().paymentInfo.paymentStatus === 'paid') {
          const paymentsRef = collection(DB, "payments");
          const q = query(paymentsRef, where("jobId", "==", listingId));
          const paymentSnap = await getDocs(q);
          
          if (!paymentSnap.empty) {
            setPayment(paymentSnap.docs[0].data());
          }
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ImageCarousel
          images={listing?.imageUrls}
          onImageChange={setCurrentImageIndex}
        />
        
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {currentImageIndex + 1}/{listing?.imageUrls?.length || 0}
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{listing?.orderName}</Text>
            <StatusChip status={listing?.status} />
          </View>

          <InfoCard 
            title="Email"
            content={listing?.email || "Not provided"}
          />

          <InfoCard 
            title="Description"
            content={listing?.description || "No description available."}
          />

          <InfoCard 
            title="Pickup Address"
            content={listing?.pickupLocation?.address || "Not specified"}
          />

          <InfoCard 
            title="Dropoff Address"
            content={listing?.dropoffLocation?.address || "Not specified"}
          />
           {listing?.paymentInfo?.paymentStatus == 'paid' && (
          <PaymentInfoCard payment={payment} />
        )}
          {listing?.status == 'in_progress' && (
            
            <View style={[styles.paymentCard,{ flex: 1, height: 300 }]}>

    
            <View style={styles.paymentHeader}>
               <Ionicons name="location" size={24} color="#2196F3" />
               <Text style={styles.paymentTitle}>Location Details</Text>
              </View>
            <DriverMap pickup={listing?.pickupLocation} dropoff={listing?.dropoffLocation} driverLocation={listing?.driverLocation} />
           </View>
            
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.navigate('FurnitureLists')}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSliderContainer: {
    height: 400,
    backgroundColor: "#000",
  },
  imageContainer: {
    width,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  productImage: {
    width,
    height: 400,
    resizeMode: "cover",
  },
  imageCounter: {
    position: "absolute",
    top: 350,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageCounterText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  contentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginRight: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  infoContent: {
    fontSize: 16,
    color: "#1A1A1A",
    lineHeight: 24,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 24,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
    borderRadius: 24,
  },
  paymentCard: {
    backgroundColor: '#F8F9FA',
    marginTop: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  paymentInfo: {
    gap: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
  },
});

export default ListingDetail