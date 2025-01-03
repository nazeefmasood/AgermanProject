import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Card, Text, Chip, Button } from "react-native-paper";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import DB from "../../../database/firebaseConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@clerk/clerk-expo";

const CompanyFare = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(true);
  const [orderDetails, setOrderDetails] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [moverDetail, setMoverDetail] = useState();
  const [fare, setFare] = useState(null);
  const [publishableKey, setPublishableKey] = useState("");

  const { companyId, jobId, carId, carFare } = useLocalSearchParams();
  const key = "AIzaSyC6kkz9yNjthTzu8vGULBRafD-4B1Hnc_o";
  const { user } = useUser();

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([
        fetchLocations(),
        fetchMover(),
        fetchPublishableKey(),
      ]);
      setIsCalculating(false);
    };
    initialize();
  }, []);

  const fetchPublishableKey = async () => {
    const response = await fetch("http://192.168.1.9:3000/pubkey", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    console.log(res);

    // fetch key from your server here
    setPublishableKey(res.key);
  };
  const fetchMover = async () => {
    try {
      const docSnap = await getDoc(doc(DB, "companies", companyId));
      if (docSnap.exists()) {
        setMoverDetail(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching mover:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const docSnap = await getDoc(doc(DB, "furnitureOrders", jobId));
      if (docSnap.exists()) {
        setOrderDetails(docSnap.data());
        const data = docSnap.data();
        setPickupLocation(data.pickupLocation);
        setDropoffLocation(data.dropoffLocation);

        const distanceMatrix = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${data.pickupLocation.placeId}&destinations=place_id:${data.dropoffLocation.placeId}&key=${key}`
        );
        const response = await distanceMatrix.json();

        if (response.rows[0]?.elements[0]?.distance) {
          const distanceInKm =
            response.rows[0].elements[0].distance.value / 1000;
          const durationInHours =
            response.rows[0].elements[0].duration.value / 3600;

          setDistance(distanceInKm);
          setDuration(durationInHours);
          setFare(calculateFare(distanceInKm));
        }
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const calculateFare = (distance) => {
    const farePerKm = 300;
    const averageDriverPay = 2;
    return distance * (farePerKm + averageDriverPay + Number(carFare));
  };
  const initializePayment = async () => {
    try {
      const params = await fetchPaymentSheetParams();
      if (!params) {
        alert("Failed to fetch payment params");
        return;
      } 

      const { paymentIntent, ephemeralKey, customer } = params;

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Moving Service",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: moverDetail?.companyName || "Customer",
        },
      });

      if (error) {
        console.log("Payment sheet init error:", error);
        alert(`Error initializing payment: ${error.message}`);
        return;
      }

      setLoading(true);
      return true;
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert(`Error: ${error.message}`);
      return false;
    }
  };

  // const handlePayment = async () => {
  //   const initialized = await initializePayment();
  //   if (!initialized) return;

  //   try {
  //     const { error } = await presentPaymentSheet();
  //     if (error) {
  //       console.log("Payment error:", error);
  //       alert(`Payment failed: ${error.message}`);
  //       return;
  //     }

  //     await updateDoc(doc(DB, "furnitureOrders", jobId), { status: 'processing' });
  //     alert("Payment successful! Your order is confirmed.");
  //   } catch (error) {
  //     console.error("Present payment sheet error:", error);
  //     alert(`Error: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handlePayment = async () => {
    const initialized = await initializePayment();
    if (!initialized) return;

    try {
      const { error, paymentIntent } = await presentPaymentSheet();
      if (error) {
        console.log("Payment error:", error);
        alert(`Payment failed: ${error.message}`);
        return;
      }

      // Create payment record in Firebase
      const paymentData = {
        jobId: jobId,
        amount: fare,
        status: "completed",
        timestamp: serverTimestamp(),
        userId: user.id, // Make sure you have access to userId
        companyId: companyId,
        paymentMethod: "card",
        metadata: {
          distance: distance,
          duration: duration,
          pickupLocation: pickupLocation,
          dropoffLocation: dropoffLocation,
        },
      };

      // Add to payments collection
      const paymentRef = collection(DB, "payments");
      await addDoc(paymentRef, paymentData);

      // Update order status
      await updateDoc(doc(DB, "furnitureOrders", jobId), {
        paymentInfo: {
          paymentStatus: "paid",
          paidAmount: fare,
          paidAt: serverTimestamp(),
        },
      });
      try {
        await fetch("http://192.168.1.9:4000/api/Payment-Notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pushToken: orderDetails.pushToken,
            metadata: {
              name: orderDetails.orderName,
              amountPaid: orderDetails.paymentInfo.paidAmount,
            },
          }),
        });
      } catch (error) {
        console.log(error);
      }
      alert("Payment successful! Your order is confirmed.");
    } catch (error) {
      console.error("Payment or database error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const fetchPaymentSheetParams = async () => {
    const total = fare;
    try {
      console.log("Requesting payment sheet params with total:", total);
      const response = await fetch("http://192.168.1.9:3000/payment-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total: total,
          metadata: {
            jobId: jobId, // from your useLocalSearchParams
            userId: user.id, // You'll need to pass this from your auth context or props
          },
        }),
      });

      const data = await response.json();
      console.log("Payment sheet params response:", data);

      if (!data.paymentIntent) {
        throw new Error("Missing payment intent in response");
      }

      return data;
    } catch (error) {
      console.error("Error fetching payment params:", error);
      return null;
    }
  };

  if (isCalculating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Calculating fare...</Text>
      </View>
    );
  }

  return (
    <StripeProvider publishableKey={publishableKey}>
      <LinearGradient colors={["#1a1f38", "#2d3250"]} style={styles.container}>
        {isCalculating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff6b6b" />
            <Text style={styles.loadingText}>Calculating your fare...</Text>
          </View>
        ) : (
          <>
            <Card style={styles.companyCard}>
              <LinearGradient
                colors={["#2c3e50", "#3498db"]}
                style={styles.companyGradient}
              >
                <MaterialIcons
                  name="business"
                  size={40}
                  color="#fff"
                  style={styles.companyIcon}
                />
                <Text style={styles.companyName}>
                  {moverDetail?.companyName}
                </Text>
                <Text style={styles.companyEmail}>{moverDetail?.email}</Text>
              </LinearGradient>
            </Card>

            <View style={styles.routeContainer}>
              <View style={styles.locationBox}>
                <MaterialIcons name="location-on" size={24} color="#ff6b6b" />
                <Text style={styles.locationText}>
                  {pickupLocation?.address?.substring(0, 35)}...
                </Text>
              </View>

              <View style={styles.routeLine}>
                <MaterialIcons name="more-vert" size={24} color="#4ecdc4" />
              </View>

              <View style={styles.locationBox}>
                <MaterialIcons name="flag" size={24} color="#4ecdc4" />
                <Text style={styles.locationText}>
                  {dropoffLocation?.address?.substring(0, 35)}...
                </Text>
              </View>
            </View>

            <Card style={styles.fareCard}>
              <LinearGradient
                colors={["#2193b0", "#6dd5ed"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fareGradient}
              >
                <View style={styles.fareMetrics}>
                  <View style={styles.metric}>
                    <MaterialIcons name="straighten" size={24} color="#fff" />
                    <Text style={styles.metricValue}>
                      {distance?.toFixed(2)} km
                    </Text>
                    <Text style={styles.metricLabel}>Distance</Text>
                  </View>

                  <View style={styles.metricDivider} />

                  <View style={styles.metric}>
                    <MaterialIcons name="schedule" size={24} color="#fff" />
                    <Text style={styles.metricValue}>
                      {(duration * 60)?.toFixed(0)} mins
                    </Text>
                    <Text style={styles.metricLabel}>Duration</Text>
                  </View>

                  <View style={styles.metricDivider} />

                  <View style={styles.metric}>
                    <MaterialIcons name="payments" size={24} color="#fff" />
                    <Text style={styles.metricValue}>
                      {fare?.toFixed(0)} PKR
                    </Text>
                    <Text style={styles.metricLabel}>Fare</Text>
                  </View>
                </View>
              </LinearGradient>
            </Card>

            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePayment}
              disabled={loading}
            >
              <LinearGradient
                colors={["#ff6b6b", "#ee5253"]}
                style={styles.payButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.payButtonContent}>
                    <Text style={styles.payButtonText}>Pay Now</Text>
                    <MaterialIcons name="lock" size={24} color="#fff" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </LinearGradient>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
  },
  companyCard: {
    borderRadius: 15,
    overflow: "hidden",
    elevation: 8,
  },
  companyGradient: {
    padding: 20,
    alignItems: "center",
  },
  companyIcon: {
    marginBottom: 10,
  },
  companyName: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  companyEmail: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
    marginTop: 5,
  },
  routeContainer: {
    marginVertical: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  locationText: {
    color: "#fff",
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  routeLine: {
    alignItems: "center",
    marginVertical: 4,
  },
  fareCard: {
    borderRadius: 15,
    overflow: "hidden",
    elevation: 8,
  },
  fareGradient: {
    padding: 20,
  },
  fareMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metric: {
    alignItems: "center",
    flex: 1,
  },
  metricValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  metricLabel: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 14,
    marginTop: 4,
  },
  metricDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  payButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 8,
  },
  payButtonGradient: {
    padding: 16,
  },
  payButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default CompanyFare;
