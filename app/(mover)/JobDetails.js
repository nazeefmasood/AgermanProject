import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import DB from "../../database/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Surface, Avatar, Text, Divider } from "react-native-paper";
import MapScreen from "../../components/Companies/MapScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
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

const JobDetails = () => {
  const { jobId } = useLocalSearchParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchJobDetails = async () => {
    try {
      const jobDoc = await getDoc(doc(DB, "furnitureOrders", jobId));
      if (jobDoc.exists()) {
        setJob({ id: jobDoc.id, ...jobDoc.data() });
      } else {
        Alert.alert("Error", "Job not found.");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      Alert.alert("Error", "Failed to fetch job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchJobDetails();
  }, [jobId]);

  const updateJobStatus = async (status) => {
    try {
      await updateDoc(doc(DB, "furnitureOrders", jobId), {
        bookingStatus: status,
      });
      Alert.alert("Success", `Job status updated to ${status}`);
      setJob((prev) => ({ ...prev, status: status }));
    } catch (error) {
      console.error("Error updating job status:", error);
      Alert.alert("Error", "Failed to update job status.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!job) return null;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapScreen job={job} />
        <Surface style={styles.statusOverlay}>
          <Text style={styles.statusText}>{job.bookingStatus}</Text>
          <MaterialCommunityIcons
            name={
              job.bookingStatus === "completed"
                ? "check-circle"
                : "clock-outline"
            }
            size={20}
            color="#fff"
          />
        </Surface>
      </View>

      <ScrollView style={styles.detailsContainer}>
        <Surface style={styles.card}>
          <View style={styles.header}>
            <Avatar.Text
              size={50}
              label={job.orderName?.substring(0, 2).toUpperCase() || "NA"}
              style={styles.avatar}
            />
            <View style={styles.headerText}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={styles.title}>{job.orderName}</Text>
              <StatusBadge status={job.status} />
            </View>
              <Text style={styles.subtitle}>
                Order #{job.id?.substring(0, 6)}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <InfoSection title="Move Details">
            <InfoRow icon="clock" text={`${job.date} at ${job.time}`} />
            <InfoRow icon="phone" text={job.phoneNumber} />
            <InfoRow icon="email" text={job.email} />
          </InfoSection>

          <InfoSection title="Locations">
            <LocationCard
              type="Pickup"
              address={job.pickupLocation?.address}
              icon="export-variant"
            />
            <LocationCard
              type="Dropoff"
              address={job.dropoffLocation?.address}
              icon="import"
            />
          </InfoSection>

          <InfoSection title="Driver">
            {job.isDriverAssigned ? (
              <View style={styles.driverInfo}>
                <Avatar.Text
                  size={40}
                  label={job.assignedDriver.name?.substring(0, 2).toUpperCase()}
                  style={styles.driverAvatar}
                />
                <Text style={styles.driverName}>{job.assignedDriver.name}</Text>
              </View>
            ) : (
              <Button
                mode="contained"
                icon="account-plus"
                onPress={() =>
                  router.push({
                    pathname: "DriversList",
                    params: { orderId: jobId },
                  })
                }
                style={styles.assignButton}
              >
                Assign Driver
              </Button>
            )}
          </InfoSection>
        </Surface>

        <View style={styles.actions}>
          
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
          >
            Back
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const InfoSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ icon, text }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#666" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const LocationCard = ({ type, address, icon }) => (
  <Surface style={styles.locationCard}>
    <MaterialCommunityIcons name={icon} size={24} color="#6200ee" />
    <View style={styles.locationInfo}>
      <Text style={styles.locationType}>{type}</Text>
      <Text style={styles.locationAddress}>{address}</Text>
    </View>
  </Surface>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mapContainer: {
    height: 200,
    width: width,
    position: "relative",
  },
  statusOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#6200ee",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 12,
  },
  statusText: {
    color: "#fff",
    marginRight: 4,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: "#6200ee",
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#666",
    marginTop: 2,
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: "#333",
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#f8f8f8",
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
  locationInfo: {
    marginLeft: 12,
  },
  locationType: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: "#333",
  },
  driverInfo: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    alignItems: "center",
  },
  driverAvatar: {
    backgroundColor: "#6200ee",
    marginRight: 12,
  },
  driverName: {
    fontSize: 16,
    color: "#333",
  },
  assignButton: {
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  button: {
    flex: 1,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  completeButton: {
    backgroundColor: "#2196F3",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
});

export default JobDetails;
