import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import DB, { authFirebase } from "../../database/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { router } from "expo-router";

const DriverHome = () => {
  const navigation = useNavigation();
  const [driverData, setDriverData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [location, setLocation] = useState(null);
  const [jobStarted, setJobStarted] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sharingLocation, setSharingLocation] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    setupDriver();
    return () => locationSubscription?.remove();
  }, []);

  useEffect(() => {
    if (driverData?.assignedJob?.orderDetails) {
      setOrigin(driverData.assignedJob.orderDetails.pickupLocation);
      setDestination(driverData.assignedJob.orderDetails.deliveryLocation);
    }
  }, [driverData]);

  const setupDriver = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      await Promise.all([fetchDriverAndJobData(), setupLocationTracking()]);
      setIsLoading(false);
    }
  };

  const setupLocationTracking = async () => {
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  const fetchDriverAndJobData = async () => {
    try {
      // Fetch driver data
      const driversRef = collection(DB, "drivers");
      const driverQuery = query(
        driversRef,
        where("driver_uid", "==", authFirebase.currentUser.uid)
      );

      const driverQuerySnapshot = await getDocs(driverQuery);
      if (!driverQuerySnapshot.empty) {
        const driverDoc = driverQuerySnapshot.docs[0];
        const driverData = { ...driverDoc.data(), id: driverDoc.id };
        setDriverData(driverData);

        // Real-time updates for driver data
        onSnapshot(doc(DB, "drivers", driverDoc.id), (doc) => {
          setDriverData({ ...doc.data(), id: doc.id });
        });

        // Fetch job data if assigned job exists
        if (driverData.assignedJob?.jobId) {
          console.log(
            "Fetching job data for Job ID:",
            driverData.assignedJob.jobId
          );

          const jobDoc = await getDoc(
            doc(DB, "furnitureOrders", driverData.assignedJob.jobId)
          );

          if (jobDoc.exists()) {
            setJobData({ id: jobDoc.id, ...jobDoc.data() });

            // Real-time updates for job data
            onSnapshot(doc(DB, "furnitureOrders", jobDoc.id), (doc) => {
              setJobData({ id: doc.id, ...doc.data() });
            });
          } else {
            Alert.alert("Error", "Job not found.");
            router.back();
          }
        } else {
          console.log("No assigned job found for the driver.");
        }
      } else {
        Alert.alert("Error", "Driver data not found.");
      }
    } catch (error) {
      console.error("Error fetching driver or job data:", error);
    }
  };

  const startJob = async () => {
    if (!driverData?.assignedJob) return;

    try {
      const jobRef = doc(DB, "furnitureOrders", driverData.assignedJob.jobId);
      const startTime = new Date().toISOString();

      await updateDoc(jobRef, {
        status: "in_progress",
        startTime,
      });

      // Find the existing notification for this job ID
      const notificationsRef = collection(DB, "notifications");
      const notificationQuery = query(
        notificationsRef,
        where("user_info.jobId", "==", driverData.assignedJob.jobId)
      );
      const notificationSnapshot = await getDocs(notificationQuery);

      if (!notificationSnapshot.empty) {
        // Get the user ID from the notification
        const notificationDoc = notificationSnapshot.docs[0];
        const userId = notificationDoc.data().user_info.userId;
        const newNotificationData = {
          message: `The Job with ID ${driverData.assignedJob.jobId} has started.`,
          type: "job",
          timestamp: serverTimestamp(),
          read: false,
          user_info: {
            userId: userId, // From the found notification
            jobId: driverData.assignedJob.jobId,
            amount: driverData.assignedJob.orderDetails.fare,
          },
        };
        await addDoc(notificationsRef, newNotificationData);
      } else {
        console.error("No notification found for the given job ID.");
      }
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        async (newLocation) => {
          const newCoords = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          setLocation(newCoords);

          await updateDoc(jobRef, {
            driverLocation: {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              timestamp: new Date().toISOString(),
            },
          });
        }
      );

      setLocationSubscription(subscription);
      setJobStarted(true);
      setSharingLocation(true);
    } catch (error) {
      console.error("Failed to start job:", error);
    }
  };

  const completeJob = async () => {
    if (!driverData?.assignedJob) return;

    try {
      const jobRef = doc(DB, "furnitureOrders", driverData.assignedJob.jobId);

      // Update job status to completed
      await updateDoc(jobRef, {
        status: "completed",
        isCompleted: true,
        endTime: new Date().toISOString(),
      });

      // Find the existing notification for this job ID
      const notificationsRef = collection(DB, "notifications");
      const notificationQuery = query(
        notificationsRef,
        where("user_info.jobId", "==", driverData.assignedJob.jobId)
      );
      const notificationSnapshot = await getDocs(notificationQuery);

      if (!notificationSnapshot.empty) {
        // Get the user ID from the notification
        const notificationDoc = notificationSnapshot.docs[0];
        const userId = notificationDoc.data().user_info.userId;

        // Add a new notification for the user
        const newNotificationData = {
          message: `The Job with ID ${driverData.assignedJob.jobId} has been completed.`,
          type: "job",
          timestamp: serverTimestamp(),
          read: false,
          user_info: {
            userId: userId, // From the found notification
            jobId: driverData.assignedJob.jobId,
            amount: driverData.assignedJob.orderDetails.fare, // Use the fare from the job details
          },
        };
        await addDoc(notificationsRef, newNotificationData);

        // Mark the driver as available and clear the assigned job
      } else {
        console.error("No notification found for the given job ID.");
      }

      await updateDoc(doc(DB, "drivers", driverData.id), {
        isAvailable: true,
        assignedJob: {},
      });
      // Stop location sharing
      locationSubscription?.remove();
      setLocationSubscription(null);
      setJobStarted(false);
      setSharingLocation(false);

      Alert.alert("Job Completed", "The job has been successfully completed.");
    } catch (error) {
      console.error("Failed to complete job:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(authFirebase);
      router.replace("Login"); // Adjust if the login screen is named differently
    } catch (error) {
      console.error("Error signing out: ", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <ScrollView>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: driverData?.licenseUrl }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{driverData?.name}</Text>
          <View style={styles.statusBadge}>
            <MaterialIcons
              name={driverData?.isAvailable ? "check-circle" : "cancel"}
              size={24}
              color={driverData?.isAvailable ? "green" : "red"}
            />
            <Text style={styles.statusText}>
              {driverData?.isAvailable ? "Available" : "Busy"}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <MaterialIcons name="exit-to-app" size={24} color="white" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        {location && (
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={location}
              showsUserLocation={true}
              followsUserLocation={true}
            >
              {origin && (
                <Marker coordinate={origin} title="Pickup" pinColor="green" />
              )}
              {destination && (
                <Marker
                  coordinate={destination}
                  title="Delivery"
                  pinColor="red"
                />
              )}
              {origin && destination && (
                <MapViewDirections
                  origin={origin}
                  destination={destination}
                  apikey="AIzaSyC6kkz9yNjthTzu8vGULBRafD-4B1Hnc_o"
                  strokeWidth={8}
                  strokeColor="blue"
                  onReady={(result) => {
                    mapRef.current.fitToCoordinates(result.coordinates, {
                      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    });
                  }}
                />
              )}
            </MapView>
          </View>
        )}

        {driverData.isAvailable !== true && driverData?.assignedJob && (
          <View style={styles.card}>
            <Text style={styles.title}>Current Job</Text>
            <View style={styles.detail}>
              <MaterialIcons name="person" size={20} color="#666" />
              <Text style={styles.detailText}>
                Customer: {driverData.assignedJob.orderDetails.customerName}
              </Text>
            </View>
            <View style={styles.detail}>
              <MaterialIcons name="description" size={20} color="#666" />
              <Text style={styles.detailText}>
                Description:{" "}
                {driverData.assignedJob.orderDetails.orderDescription}
              </Text>
            </View>

            {jobStarted || jobData?.status == "in_progress" ? (
              <View>
                <Text style={styles.infoText}>
                  Real-time location is being shared.
                </Text>
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={completeJob}
                >
                  <MaterialIcons name="check" size={24} color="white" />
                  <Text style={styles.buttonText}>Complete Job</Text>
                </TouchableOpacity>
              </View>
            ) : (
              jobData?.status !== "in_progress" && (
                <TouchableOpacity style={styles.startButton} onPress={startJob}>
                  <MaterialIcons name="play-arrow" size={24} color="white" />
                  <Text style={styles.buttonText}>Start Job</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        )}
        {driverData.isAvailable && (
          <Text style={styles.infoText}>No Jobs Currently Assigned to you</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileSection: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
  },
  statusText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#666",
  },
  mapContainer: {
    height: 300,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  map: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#666",
  },
  startButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#f44336", // Red color for logout button
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default DriverHome;
