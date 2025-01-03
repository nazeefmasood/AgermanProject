// // import 'react-native-get-random-values';
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   ActivityIndicator,
// } from "react-native";
// import DateTimePicker from "react-native-modal-datetime-picker";
// import * as ImagePicker from "expo-image-picker";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import DB, { storage } from "../../database/firebaseConfig"; // Make sure this path is correct
// import Icon from "react-native-vector-icons/MaterialIcons";
// import LocationPickerModal from "./LocationPickerModal";
// import { useUser } from "@clerk/clerk-expo";
// import { registerForPushNotificationsAsync } from "../../utility/notificationHelper";
// const FurnitureForm = () => {
//   const { user } = useUser();
//   const [images, setImages] = useState([]);
//   const [orderName, setOrderName] = useState("");
//   const [email, setEmail] = useState("");
//   const [description, setDescription] = useState("");
//   const [movers, setMovers] = useState("");
//   const [date, setDate] = useState(new Date());
//   const [time, setTime] = useState("");
//   const [pickupLocation, setPickupLocation] = useState(null);
//   const [dropoffLocation, setDropoffLocation] = useState(null);
//   const [datePickerVisible, setDatePickerVisible] = useState(false);
//   const [timePickerVisible, setTimePickerVisible] = useState(false);
//   const [showPickupModal, setShowPickupModal] = useState(false);
//   const [showDropoffModal, setShowDropoffModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [pushToken, setPushToken] = useState(null);

//   // Get push token when component mounts

//   const selectImages = async () => {
//     // Request permission
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Sorry, we need camera roll permissions to make this work!");
//       return;
//     }

//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true,
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setImages((prev) => [...prev, ...result.assets]);
//       }
//     } catch (error) {
//       console.log("ImagePicker Error: ", error);
//       Alert.alert("Error", "Failed to pick image");
//     }
//   };
//   console.log(user?.id);

//   const uploadImages = async (images) => {
//     try {
//       const uploadedUrls = await Promise.all(
//         images.map(async (image) => {
//           // Create a unique filename
//           const filename = `furniture_images/${
//             user.id
//           }${Date.now()}_${Math.random().toString(36).substring(7)}`;
//           const storageRef = ref(storage, filename);

//           // Fetch the image and convert to blob
//           const response = await fetch(image.uri);
//           const blob = await response.blob();

//           // Upload to Firebase Storage
//           await uploadBytes(storageRef, blob);

//           // Get download URL
//           const downloadURL = await getDownloadURL(storageRef);
//           return downloadURL;
//         })
//       );

//       return uploadedUrls;
//     } catch (error) {
//       console.error("Error uploading images:", error);
//       throw new Error("Failed to upload images");
//     }
//   };

//   const handleSubmit = async () => {
//     // Validate all required fields
//     if (
//       !orderName.trim() ||
//       !email.trim() ||
//       !description.trim() ||
//       !movers ||
//       !date ||
//       !time ||
//       !pickupLocation ||
//       !dropoffLocation
//     ) {
//       Alert.alert("Validation Error", "Please fill all required fields.");
//       return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       Alert.alert("Invalid Email", "Please enter a valid email address.");
//       return;
//     }

//     // Show loading indicator
//     setIsLoading(true);

//     try {
//       // Upload images first and get their URLs
//       let imageUrls = [];
//       if (images.length > 0) {
//         imageUrls = await uploadImages(images);
//       }

//       // Prepare the order data
//       const orderData = {
//         userId: user.id,
//         orderName: orderName.trim(),
//         email: email.trim(),
//         description: description.trim(),
//         movers: parseInt(movers, 10),
//         date: date.toISOString(),
//         time,
//         isCompleted: false,
//         isDriverAssigned: false,
//         pickupLocation: {
//           placeId: pickupLocation.placeId,
//           latitude: pickupLocation.latitude,
//           longitude: pickupLocation.longitude,
//           address: pickupLocation.address,
//         },
//         dropoffLocation: {
//           placeId: dropoffLocation.placeId,
//           latitude: dropoffLocation.latitude,
//           longitude: dropoffLocation.longitude,
//           address: dropoffLocation.address,
//         },
//         imageUrls,
//         paymentInfo: {
//           paidAmount: "",
//           paidAt: "",
//           paymentStatus: "",
//         },
//         status: "pending",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         totalDistance: null || "", // Can be calculated later if needed
//         estimatedPrice: null || "", // Can be calculated later if needed
//         // Save the push token
//         notificationEnabled: true,
//         moverId: null || "", // Can be calculated later if needed
//       };

//       // Log the data being saved
//       console.log("Saving order data:", JSON.stringify(orderData, null, 2));

//       // Save to Firestore
//       const docRef = await addDoc(collection(DB, "furnitureOrders"), orderData);

//       console.log("Order saved successfully with ID:", docRef.id);

//       // Show success message
//       Alert.alert("Success", "Your order has been submitted successfully!", [
//         {
//           text: "OK",
//           onPress: () => {
//             resetForm();
//           },
//         },
//       ]);
//     } catch (error) {
//       console.error("Error submitting order:", error);
//       Alert.alert("Error", "Failed to submit your order. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setOrderName("");
//     setEmail("");
//     setDescription("");
//     setMovers("");
//     setDate(null);
//     setTime("");
//     setImages([]);
//     setPickupLocation(null);
//     setDropoffLocation(null);
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
//       >
//         <ScrollView
//           contentContainerStyle={styles.container}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <Text style={styles.header}>Create Furniture Order</Text>

//           {/* Image Picker */}
//           <TouchableOpacity style={styles.imagePicker} onPress={selectImages}>
//             <Icon name="add-photo-alternate" size={24} color="#666" />
//             <Text style={styles.imagePickerText}>Upload Images</Text>
//           </TouchableOpacity>
//           <ScrollView horizontal style={styles.imagePreview}>
//             {images.map((img, index) => (
//               <View key={index} style={styles.imageContainer}>
//                 <Image source={{ uri: img.uri }} style={styles.image} />
//                 <TouchableOpacity
//                   style={styles.deleteButton}
//                   onPress={() => {
//                     setImages(images.filter((_, i) => i !== index));
//                   }}
//                 >
//                   <Icon name="close" size={20} color="#fff" />
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>

//           {/* Order Name */}
//           <TextInput
//             placeholder="Order Name"
//             style={styles.input}
//             value={orderName}
//             onChangeText={setOrderName}
//           />

//           {/* Email */}
//           <TextInput
//             placeholder="Email"
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//           />

//           {/* Description */}
//           <TextInput
//             placeholder="Description of Items"
//             style={styles.input}
//             value={description}
//             onChangeText={setDescription}
//             multiline
//           />

//           {/* Movers */}
//           <TextInput
//             placeholder="Number of Movers Required"
//             style={styles.input}
//             value={movers}
//             onChangeText={setMovers}
//             keyboardType="numeric"
//           />

//           {/* Date Picker */}
//           <TouchableOpacity
//             style={styles.datePicker}
//             onPress={() => setDatePickerVisible(true)}
//           >
//             <Text style={styles.datePickerText}>
//               {date ? date.toDateString() : "Select Date"}
//             </Text>
//           </TouchableOpacity>
//           <DateTimePicker
//             isVisible={datePickerVisible}
//             mode="date"
//             onConfirm={(selectedDate) => {
//               setDate(selectedDate);
//               setDatePickerVisible(false);
//             }}
//             minimumDate={new Date()}
//             onCancel={() => setDatePickerVisible(false)}
//           />

//           {/* Time Picker */}
//           <TouchableOpacity
//             style={styles.datePicker}
//             onPress={() => setTimePickerVisible(true)}
//           >
//             <Text style={styles.datePickerText}>
//               {time ? time : "Select Time"}
//             </Text>
//           </TouchableOpacity>
//           <DateTimePicker
//             isVisible={timePickerVisible}
//             mode="time"
//             onConfirm={(selectedTime) => {
//               setTime(selectedTime.toLocaleTimeString());
//               setTimePickerVisible(false);
//             }}
//             onCancel={() => setTimePickerVisible(false)}
//           />

//           {/* Pickup Location Button */}
//           <TouchableOpacity
//             style={styles.locationButton}
//             onPress={() => setShowPickupModal(true)}
//           >
//             <Text style={styles.locationButtonText}>
//               {pickupLocation
//                 ? pickupLocation.address
//                 : "Select Pickup Location"}
//             </Text>
//             <Icon name="place" size={24} color="#666" />
//           </TouchableOpacity>

//           {/* Dropoff Location Button */}
//           <TouchableOpacity
//             style={styles.locationButton}
//             onPress={() => setShowDropoffModal(true)}
//           >
//             <Text style={styles.locationButtonText}>
//               {dropoffLocation
//                 ? dropoffLocation.address
//                 : "Select Dropoff Location"}
//             </Text>
//             <Icon name="place" size={24} color="#666" />
//           </TouchableOpacity>

//           {/* Location Picker Modals */}
//           <LocationPickerModal
//             visible={showPickupModal}
//             onClose={() => setShowPickupModal(false)}
//             onLocationSelect={(location) => {
//               setPickupLocation(location);
//               setShowPickupModal(false);
//             }}
//             title="Select Pickup Location"
//           />

//           <LocationPickerModal
//             visible={showDropoffModal}
//             onClose={() => setShowDropoffModal(false)}
//             onLocationSelect={(location) => {
//               setDropoffLocation(location);
//               setShowDropoffModal(false);
//             }}
//             title="Select Dropoff Location"
//           />

//           {/* Submit Button */}
//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               isLoading && styles.submitButtonDisabled,
//             ]}
//             onPress={handleSubmit}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitButtonText}>Submit Order</Text>
//             )}
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: "#f9f9f9",
//     paddingBottom: 100,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   imagePicker: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   imagePickerText: {
//     marginLeft: 8,
//     fontSize: 16,
//     color: "#666",
//   },
//   imagePreview: {
//     marginBottom: 16,
//   },
//   imageContainer: {
//     position: "relative",
//     marginRight: 8,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//   },
//   deleteButton: {
//     position: "absolute",
//     right: -8,
//     top: -8,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   input: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     fontSize: 16,
//     minHeight: 45,
//   },
//   datePicker: {
//     backgroundColor: "#ddd",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   datePickerText: {
//     textAlign: "center",
//   },
//   locationButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//     borderColor: "#ddd",
//     borderWidth: 1,
//   },
//   locationButtonText: {
//     fontSize: 16,
//     color: "#333",
//     flex: 1,
//   },
//   submitButton: {
//     backgroundColor: "#4CAF50",
//     padding: 16,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   submitButtonDisabled: {
//     backgroundColor: "#A5D6A7",
//   },
//   submitButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default FurnitureForm;















import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Animated,
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DB, { storage } from "../../database/firebaseConfig";
import Icon from "react-native-vector-icons/MaterialIcons";
import LocationPickerModal from "./LocationPickerModal";
import { useUser } from "@clerk/clerk-expo";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

const FurnitureForm = () => {

  const { user } = useUser();
    const [images, setImages] = useState([]);
    const [orderName, setOrderName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [movers, setMovers] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState("");
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [showDropoffModal, setShowDropoffModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pushToken, setPushToken] = useState(null);
  
    // Get push token when component mounts
  
    const selectImages = async () => {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
  
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 1,
        });
  
        if (!result.canceled) {
          setImages((prev) => [...prev, ...result.assets]);
        }
      } catch (error) {
        console.log("ImagePicker Error: ", error);
        Alert.alert("Error", "Failed to pick image");
      }
    };
    console.log(user?.id);
  
    const uploadImages = async (images) => {
      try {
        const uploadedUrls = await Promise.all(
          images.map(async (image) => {
            // Create a unique filename
            const filename = `furniture_images/${
              user.id
            }${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const storageRef = ref(storage, filename);
  
            // Fetch the image and convert to blob
            const response = await fetch(image.uri);
            const blob = await response.blob();
  
            // Upload to Firebase Storage
            await uploadBytes(storageRef, blob);
  
            // Get download URL
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
          })
        );
  
        return uploadedUrls;
      } catch (error) {
        console.error("Error uploading images:", error);
        throw new Error("Failed to upload images");
      }
    };
  
    const handleSubmit = async () => {
      // Validate all required fields
      if (
        !orderName.trim() ||
        !email.trim() ||
        !description.trim() ||
        !movers ||
        !date ||
        !time ||
        !pickupLocation ||
        !dropoffLocation
      ) {
        Alert.alert("Validation Error", "Please fill all required fields.");
        return;
      }
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }
  
      // Show loading indicator
      setIsLoading(true);
  
      try {
        // Upload images first and get their URLs
        let imageUrls = [];
        if (images.length > 0) {
          imageUrls = await uploadImages(images);
        }
  
        // Prepare the order data
        const orderData = {
          userId: user.id,
          orderName: orderName.trim(),
          email: email.trim(),
          description: description.trim(),
          movers: parseInt(movers, 10),
          date: date.toISOString(),
          time,
          isCompleted: false,
          isDriverAssigned: false,
          pickupLocation: {
            placeId: pickupLocation.placeId,
            latitude: pickupLocation.latitude,
            longitude: pickupLocation.longitude,
            address: pickupLocation.address,
          },
          dropoffLocation: {
            placeId: dropoffLocation.placeId,
            latitude: dropoffLocation.latitude,
            longitude: dropoffLocation.longitude,
            address: dropoffLocation.address,
          },
          imageUrls,
          paymentInfo: {
            paidAmount: "",
            paidAt: "",
            paymentStatus: "",
          },
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          totalDistance: null || "", // Can be calculated later if needed
          estimatedPrice: null || "", // Can be calculated later if needed
          // Save the push token
          notificationEnabled: true,
          moverId: null || "", // Can be calculated later if needed
        };
  
        // Log the data being saved
        console.log("Saving order data:", JSON.stringify(orderData, null, 2));
  
        // Save to Firestore
        const docRef = await addDoc(collection(DB, "furnitureOrders"), orderData);
  
        console.log("Order saved successfully with ID:", docRef.id);
  
        // Show success message
        Alert.alert("Success", "Your order has been submitted successfully!", [
          {
            text: "OK",
            onPress: () => {
              resetForm();
            },
          },
        ]);
      } catch (error) {
        console.error("Error submitting order:", error);
        Alert.alert("Error", "Failed to submit your order. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
  
    const resetForm = () => {
      setOrderName("");
      setEmail("");
      setDescription("");
      setMovers("");
      setDate(null);
      setTime("");
      setImages([]);
      setPickupLocation(null);
      setDropoffLocation(null);
    };
  // ... (keep all existing state and functions)

  const [scrollY] = useState(new Animated.Value(0));
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 60],
    extrapolate: 'clamp',
  });

  const renderSectionHeader = (title, icon) => (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={styles.sectionHeader}
    >
      <Icon name={icon} size={24} color="#2196F3" />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </MotiView>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <LinearGradient
            colors={['#2196F3', '#1976D2']}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Create Furniture Order</Text>
            <Text style={styles.headerSubtitle}>Fill in the details below</Text>
          </LinearGradient>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {renderSectionHeader("Upload Images", "photo-library")}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <TouchableOpacity style={styles.imagePicker} onPress={selectImages}>
              <LinearGradient
                colors={['#E3F2FD', '#BBDEFB']}
                style={styles.imagePickerGradient}
              >
                <Icon name="add-photo-alternate" size={32} color="#1976D2" />
                <Text style={styles.imagePickerText}>Upload Images</Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          <ScrollView horizontal style={styles.imagePreview}>
            {images.map((img, index) => (
              <MotiView
                key={index}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: index * 100 }}
                style={styles.imageContainer}
              >
                <Image source={{ uri: img.uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setImages(images.filter((_, i) => i !== index))}
                >
                  <Icon name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </MotiView>
            ))}
          </ScrollView>

          {renderSectionHeader("Basic Information", "info")}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing' }}
            style={styles.formSection}
          >
            <View style={styles.inputContainer}>
              <Icon name="shopping-bag" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Order Name"
                style={styles.input}
                value={orderName}
                onChangeText={setOrderName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="description" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Description of Items"
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="people" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Number of Movers Required"
                style={styles.input}
                value={movers}
                onChangeText={setMovers}
                keyboardType="numeric"
              />
            </View>
          </MotiView>

          {renderSectionHeader("Schedule", "event")}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 200 }}
          >
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setDatePickerVisible(true)}
            >
              <Icon name="calendar-today" size={24} color="#1976D2" />
              <Text style={styles.dateTimeButtonText}>
                {date ? date.toDateString() : "Select Date"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setTimePickerVisible(true)}
            >
              <Icon name="access-time" size={24} color="#1976D2" />
              <Text style={styles.dateTimeButtonText}>
                {time ? time : "Select Time"}
              </Text>
            </TouchableOpacity>
          </MotiView>

          {renderSectionHeader("Location", "place")}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 400 }}
          >
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => setShowPickupModal(true)}
            >
              <Icon name="location-on" size={24} color="#1976D2" />
              <Text style={styles.locationButtonText}>
                {pickupLocation ? pickupLocation.address : "Select Pickup Location"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => setShowDropoffModal(true)}
            >
              <Icon name="location-on" size={24} color="#1976D2" />
              <Text style={styles.locationButtonText}>
                {dropoffLocation ? dropoffLocation.address : "Select Dropoff Location"}
              </Text>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 600 }}
          >
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#90CAF9', '#64B5F6'] : ['#2196F3', '#1976D2']}
                style={styles.submitButtonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon name="check-circle" size={24} color="#fff" />
                    <Text style={styles.submitButtonText}>Submit Order</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          {/* Keep all modal components */}
          <DateTimePicker
            isVisible={datePickerVisible}
            mode="date"
            onConfirm={(selectedDate) => {
              setDate(selectedDate);
              setDatePickerVisible(false);
            }}
            minimumDate={new Date()}
            onCancel={() => setDatePickerVisible(false)}
          />

          <DateTimePicker
            isVisible={timePickerVisible}
            mode="time"
            onConfirm={(selectedTime) => {
              setTime(selectedTime.toLocaleTimeString());
              setTimePickerVisible(false);
            }}
            onCancel={() => setTimePickerVisible(false)}
          />

          <LocationPickerModal
            visible={showPickupModal}
            onClose={() => setShowPickupModal(false)}
            onLocationSelect={(location) => {
              setPickupLocation(location);
              setShowPickupModal(false);
            }}
            title="Select Pickup Location"
          />

          <LocationPickerModal
            visible={showDropoffModal}
            onClose={() => setShowDropoffModal(false)}
            onLocationSelect={(location) => {
              setDropoffLocation(location);
              setShowDropoffModal(false);
            }}
            title="Select Dropoff Location"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  header: {
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  imagePicker: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePickerGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '500',
  },
  imagePreview: {
    marginBottom: 24,
  },
  imageContainer: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  deleteButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateTimeButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '500',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  locationButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1976D2',
    flex: 1,
  },
  submitButton: {
    marginVertical: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});

export default FurnitureForm;