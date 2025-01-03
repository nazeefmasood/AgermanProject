// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Image,
//   SafeAreaView,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import {
//   collection,
//   addDoc,
//   query,
//   getDocs,
//   deleteDoc,
//   doc,
//   where,
// } from "firebase/firestore";
// import DB, { authFirebase, storage } from "../../database/firebaseConfig";
// import { useSignUp, useUser } from "@clerk/clerk-expo";
// import DropDownPicker from "react-native-dropdown-picker";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import * as ImagePicker from "expo-image-picker";
// import { createUserWithEmailAndPassword } from "firebase/auth";

// const CAR_TYPES = [
//   { label: "Select a vehicle type", value: "" },
//   { label: "Cargo Van", value: "Cargo Van" },
//   { label: "Flabbed", value: "Flabbed" },
//   { label: "Small Trucks-16ft", value: "Small Trucks-16ft" },
//   { label: "Refrigerated", value: "Refrigerated" },
//   { label: "Medium Box-20ft", value: "Medium Box-20ft" },
//   { label: "Large Box-26ft", value: "Large Box-26ft" },
// ];
// // Car Form Component
// const CarForm = ({ visible, onClose, onSubmit, loading }) => {
//   const { user } = useUser();
//   const [carData, setCarData] = useState({
//     carName: "",
//     carType: "",
//     company: user.username,
//     fare: "",
//     model: "",
//     licensePlate: "",
//     year: "",
//     carImage: "",
//   });
//   const [imageLoading, setImageLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [items, setItems] = useState(CAR_TYPES);

//   const pickImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//       console.log(result.assets[0].uri);

//       // if (!result.canceled) {
//       setCarData((prev) => ({
//         ...prev,
//         carImage: result.assets[0].uri,
//       }));
//       // }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick image");
//     }
//   };
//   const updateField = (field, value) => {
//     setCarData((prev) => ({ ...prev, [field]: value }));
//   };

//   const resetCarData = () => {
//     setCarData({
//       carName: "",
//       carType: "",
//       company: "",
//       fare: "",
//       model: "",
//       licensePlate: "",
//       year: "",
//       carImage: "",
//     });
//   };
//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.modalContainer}>
//         {/* <ScrollView> */}
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Add New Vehicle</Text>

//           {/* Image Picker */}
//           <TouchableOpacity
//             style={styles.imagePickerButton}
//             onPress={pickImage}
//           >
//             {carData.carImage ? (
//               <Image
//                 source={{ uri: carData.carImage }}
//                 style={styles.pickedImage}
//               />
//             ) : (
//               <View style={styles.imagePlaceholder}>
//                 <MaterialCommunityIcons
//                   name="camera-plus"
//                   size={40}
//                   color="#9CA3AF"
//                 />
//                 <Text style={styles.imagePlaceholderText}>
//                   Add Vehicle Image
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>

//           <TextInput
//             style={styles.input}
//             placeholder="Car Name"
//             value={carData.carName}
//             onChangeText={(text) =>
//               setCarData((prev) => ({ ...prev, carName: text }))
//             }
//             placeholderTextColor="#9CA3AF"
//           />

//           {/* Car Type Dropdown */}
//           <View style={styles.dropdownContainer}>
//             <DropDownPicker
//               open={open}
//               value={carData.carType}
//               items={items}
//               setOpen={setOpen}
//               setValue={(callback) => {
//                 if (typeof callback === "function") {
//                   const value = callback(carData.carType);
//                   updateField("carType", value);
//                 } else {
//                   updateField("carType", callback);
//                 }
//               }}
//               setItems={setItems}
//               placeholder="Select vehicle type"
//               style={styles.dropdown}
//               textStyle={styles.dropdownText}
//               dropDownContainerStyle={styles.dropdownList}
//               placeholderStyle={styles.dropdownPlaceholder}
//               listItemContainerStyle={styles.dropdownListItem}
//               zIndex={3000}
//               zIndexInverse={1000}
//             />
//           </View>

//           <TextInput
//             style={styles.input}
//             placeholder="Fare"
//             value={carData.fare}
//             onChangeText={(text) =>
//               setCarData((prev) => ({ ...prev, fare: text }))
//             }
//             keyboardType="numeric"
//             placeholderTextColor="#9CA3AF"
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Vehicle Model"
//             value={carData.model}
//             onChangeText={(text) =>
//               setCarData((prev) => ({ ...prev, model: text }))
//             }
//             placeholderTextColor="#9CA3AF"
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="License Plate"
//             value={carData.licensePlate}
//             onChangeText={(text) =>
//               setCarData((prev) => ({ ...prev, licensePlate: text }))
//             }
//             placeholderTextColor="#9CA3AF"
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Year"
//             value={carData.year}
//             onChangeText={(text) =>
//               setCarData((prev) => ({ ...prev, year: text }))
//             }
//             keyboardType="numeric"
//             placeholderTextColor="#9CA3AF"
//           />

//           <View style={styles.modalButtons}>
//             <TouchableOpacity
//               style={[styles.button, styles.cancelButton]}
//               onPress={onClose}
//             >
//               <Text style={styles.buttonText}>Cancel</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.button, styles.submitButton]}
//               onPress={() => onSubmit({ carData, resetCarData })}
//               disabled={loading}
//             >
//               <Text style={[styles.buttonText, styles.submitButtonText]}>
//                 {loading ? "Adding..." : "Add Vehicle"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         {/* </ScrollView> */}
//       </View>
//     </Modal>
//   );
// };
// // Driver Form Component
// const DriverForm = ({ visible, onClose, onSubmit, loading }) => {
//   const { user } = useUser();
//   const [driverData, setDriverData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     company: user.username,
//     cnic: "",
//     model: "",
//     licenseUrl: "",
//     address: "",
//     age: "",
//   });
//   const [imageLoading, setImageLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [items, setItems] = useState(CAR_TYPES);

//   const pickImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//       console.log(result.assets[0].uri);

//       // if (!result.canceled) {
//       setDriverData((prev) => ({
//         ...prev,
//         licenseUrl: result.assets[0].uri,
//       }));
//       // }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick image");
//     }
//   };
//   const updateField = (field, value) => {
//     setDriverData((prev) => ({ ...prev, [field]: value }));
//   };

//   const resetDriverData = () => {
//     setDriverData({
//       name: "",
//       email: "",
//       phone: "",
//       company: "",
//       cnic: "",
//       model: "",
//       licenseUrl: "",
//       address: "",
//       age: "",
//     });
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Add New Driver</Text>
//           {/* Image Picker */}
//           <TouchableOpacity
//             style={styles.imagePickerButton}
//             onPress={pickImage}
//           >
//             {driverData.licenseUrl ? (
//               <Image
//                 source={{ uri: driverData.licenseUrl }}
//                 style={styles.pickedImage}
//               />
//             ) : (
//               <View style={styles.imagePlaceholder}>
//                 <MaterialCommunityIcons
//                   name="camera-plus"
//                   size={40}
//                   color="#9CA3AF"
//                 />
//                 <Text style={styles.imagePlaceholderText}>
//                   Add Driving License
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>
//           <TextInput
//             style={styles.input}
//             placeholder="Full Name"
//             placeholderTextColor="#9CA3AF"
//             onChangeText={(text) =>
//               setDriverData((prev) => ({ ...prev, name: text }))
//             }
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Email Address"
//             placeholderTextColor="#9CA3AF"
//             onChangeText={(text) =>
//               setDriverData((prev) => ({ ...prev, email: text }))
//             }
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Contact Number"
//             placeholderTextColor="#9CA3AF"
//             keyboardType="phone-pad"
//             onChangeText={(text) =>
//               setDriverData((prev) => ({ ...prev, phone: text }))
//             }
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="CNIC"
//             placeholderTextColor="#9CA3AF"
//             keyboardType="phone-pad"
//             onChangeText={(text) =>
//               setDriverData((prev) => ({ ...prev, cnic: text }))
//             }
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Address"
//             placeholderTextColor="#9CA3AF"
//           />

//           <View style={styles.modalButtons}>
//             <TouchableOpacity
//               style={[styles.button, styles.cancelButton]}
//               onPress={onClose}
//             >
//               <Text style={styles.buttonText}>Cancel</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.button, styles.submitButton]}
//               onPress={() => onSubmit({ driverData, resetDriverData })}
//               disabled={loading}
//             >
//               <Text style={[styles.buttonText, styles.submitButtonText]}>
//                 {loading ? "Adding..." : "Add Driver"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };
// // Main Component
// const FleetManagementScreen = () => {
//   const [activeTab, setActiveTab] = useState("cars");
//   const [cars, setCars] = useState([]);
//   const [drivers, setDrivers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [carModalVisible, setCarModalVisible] = useState(false);
//   const [driverModalVisible, setDriverModalVisible] = useState(false);
//   const { isLoaded, signUp, setActive } = useSignUp();
//   const { user } = useUser();
//   let moverId;
//   useEffect(() => {
//     fetchMoverData();
//   }, []);

//   const fetchMoverData = async () => {
//     if (user) {
//       try {
//         const q = query(
//           collection(DB, "companies"),
//           where("username", "==", user?.username)
//         );
//         const querySnapshot = await getDocs(q);

//         const moverData = [];
//         querySnapshot.forEach((doc) => {
//           // Append the document data to the moverData array
//           moverData.push({ id: doc.id, ...doc.data() });
//           console.log(doc.id, " => ", doc.data());
//         });
//         moverId = querySnapshot.docs[0].id;
//         if (moverData.length > 0) {
//           // Assuming you only expect one matching document
//           console.log(querySnapshot.docs[0].id);
//         } else {
//           console.log("No matching company found");
//         }

//         await fetchData();
//       } catch (error) {
//         console.error("Error fetching mover data:", error);
//       }
//     }
//   };
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const carsQuery = query(
//         collection(DB, "cars"),
//         where("company", "==", user.username)
//       );
//       const driversQuery = query(
//         collection(DB, "drivers"),
//         where("company", "==", user.username)
//       );

//       const [carsSnapshot, driversSnapshot] = await Promise.all([
//         getDocs(carsQuery),
//         getDocs(driversQuery),
//       ]);

//       setCars(carsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//       setDrivers(
//         driversSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//       );
//     } catch (error) {
//       Alert.alert("Error", "Failed to fetch data");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleAddCar = async ({ carData, resetCarData }) => {
//     if (!carData.carImage) {
//       console.error("Invalid car data:");
//       return;
//     }

//     try {
//       setLoading(true);

//       let imageUrl = null;
//       if (carData.carImage) {
//         const imageRef = ref(
//           storage,
//           `car-images/${moverId || user.username}/${Date.now()}.jpg`
//         );
//         const response = await fetch(carData?.carImage);
//         const blob = await response.blob();
//         await uploadBytes(imageRef, blob);
//         imageUrl = await getDownloadURL(imageRef);
//       }
//       console.log(imageUrl);
//       console.log(carData);

//       const carRef = collection(DB, "cars");
//       const newCar = {
//         carName: carData.carName || "",
//         carType: carData.carType || "",
//         company: user.username || "",
//         fare: parseFloat(carData.fare) || 0,
//         model: carData.model || "",
//         licensePlate: carData.licensePlate || "",
//         year: carData.year || "",
//         carImage: imageUrl || "",
//         createdAt: new Date(),
//       };
//       try {
//         const docRef = await addDoc(carRef, newCar);
//         console.log("Car added with ID:", docRef.id);
//       } catch (error) {
//         console.log("error while addDoc method" + error);
//       }
//       // setCars(prev => [...prev, { id: docRef.id, ...newCar }]);
//       setCarModalVisible(false);
//       resetCarData();
//       fetchData();
//       Alert.alert("Success", "Vehicle added successfully");
//     } catch (error) {
//       console.error("Error adding car:" + error);
//       Alert.alert("Error", "Failed to add vehicle");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignUp = async (driverData) => {
//     try {
//       // Check if email exists in Firestore
//       const driverQuery = query(
//         collection(DB, "drivers"),
//         where("email", "==", driverData.email)
//       );
//       const driverSnapshot = await getDocs(driverQuery);

//       if (!driverSnapshot.empty) {
//         Alert.alert(
//           "Error",
//           "Email already exists. Please use a different email."
//         );
//         return;
//       }

//       const { user } = await createUserWithEmailAndPassword(
//         authFirebase,
//         driverData.email,
//         "123456789" // Ideally, let the driver set their password or generate one.
//       );

//       console.log("Driver created:", user);
//       return user.uid;
//     } catch (error) {
//       if (error.code === "auth/email-already-in-use") {
//         Alert.alert(
//           "Error",
//           "Email is already associated with another account."
//         );
//       } else if (error.code === "auth/invalid-email") {
//         Alert.alert("Error", "Invalid email address.");
//       } else {
//         Alert.alert("Error", "Failed to sign up the driver. Please try again.");
//       }
//       console.error(error);
//       return null;
//     }
//   };
//   const handleAddDriver = async ({ driverData, resetDriverData }) => {
//     try {
//       setLoading(true);

//       // Sign up the driver and get the UID
//       const uid = await handleSignUp(driverData);
//       if (!uid) {
//         setLoading(false);
//         return;
//       }

//       let imageUrl = null;
//       if (driverData.licenseUrl) {
//         const imageRef = ref(
//           storage,
//           `driver-images/${moverId || user.username}/${Date.now()}.jpg`
//         );
//         const response = await fetch(driverData?.licenseUrl);
//         const blob = await response.blob();
//         await uploadBytes(imageRef, blob);
//         imageUrl = await getDownloadURL(imageRef);
//       }

//       const driverRef = collection(DB, "drivers");
//       const newDriver = {
//         driver_uid: uid,
//         isAvailable: true,
//         name: driverData.name || "",
//         phone: driverData.phone || "",
//         email: driverData.email || "",
//         company: user.username || "",
//         address: driverData.address || "",
//         cnic: driverData.cnic || "",
//         licenseUrl: imageUrl || "",
//         createdAt: new Date(),
//       };

//       await addDoc(driverRef, newDriver);
//       console.log("Driver added successfully:", newDriver);

//       setDriverModalVisible(false);
//       resetDriverData();
//       fetchData();
//       Alert.alert("Success", "Driver added successfully.");
//     } catch (error) {
//       console.error("Error adding driver:", error);
//       Alert.alert("Error", "Failed to add driver. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = (id, type) => {
//     Alert.alert(
//       "Confirm Delete",
//       `Are you sure you want to delete this ${type}?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await deleteDoc(doc(DB, `${type}s`, id));
//               if (type === "car") {
//                 setCars(cars.filter((car) => car.id !== id));
//               } else {
//                 setDrivers(drivers.filter((driver) => driver.id !== id));
//               }
//             } catch (error) {
//               Alert.alert("Error", `Failed to delete ${type}`);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const renderCar = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <MaterialCommunityIcons name="car" size={24} color="#4B5563" />
//         <Text
//           style={[
//             styles.cardTitle,
//             {
//               fontSize: 18,
//               color: "blue",
//               textTransform: "capitalize",
//               fontWeight: "thin",
//             },
//           ]}
//         >
//           {item.carName}
//         </Text>
//         <TouchableOpacity
//           onPress={() => handleDelete(item.id, "car")}
//           style={styles.deleteButton}
//         >
//           <MaterialCommunityIcons name="delete" size={20} color="#EF4444" />
//         </TouchableOpacity>
//       </View>
//       <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
//         <Image
//           source={{ uri: item.carImage }}
//           width={120}
//           height={100}
//           style={{ borderRadius: 10 }}
//         />
//         <View style={[styles.cardContent, { left: 20 }]}>
//           <Text
//             style={[
//               styles.cardSubtitle,
//               { color: "black", fontWeight: "semibold", fontSize: 18 },
//             ]}
//           >
//             Type:<Text style={styles.cardSubtitle}>{item.carType}</Text>
//           </Text>
//           <Text
//             style={[
//               styles.cardSubtitle,
//               { color: "black", fontWeight: "semibold" },
//             ]}
//           >
//             License Plate :{" "}
//             <Text style={styles.cardSubtitle}>{item.licensePlate}</Text>
//           </Text>
//           <Text
//             style={[
//               styles.cardSubtitle,
//               { color: "black", fontWeight: "semibold" },
//             ]}
//           >
//             Owned By:<Text style={styles.cardSubtitle}>{item.company}</Text>
//           </Text>
//         </View>
//       </View>
//     </View>
//   );

//   const renderDriver = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <MaterialCommunityIcons name="account" size={24} color="#4B5563" />
//         <TouchableOpacity
//           onPress={() => handleDelete(item.id, "driver")}
//           style={styles.deleteButton}
//         >
//           <MaterialCommunityIcons name="delete" size={20} color="#EF4444" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.cardContent}>
//         <Text style={styles.cardTitle}>{item.name}</Text>
//         <Text style={styles.cardSubtitle}>{item.phone}</Text>
//         <Text style={styles.cardDetail}>License: {item.licenseNumber}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Tabs */}
//       <SafeAreaView />
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === "cars" && styles.activeTab]}
//           onPress={() => setActiveTab("cars")}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === "cars" && styles.activeTabText,
//             ]}
//           >
//             Vehicles
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.tab, activeTab === "drivers" && styles.activeTab]}
//           onPress={() => setActiveTab("drivers")}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === "drivers" && styles.activeTabText,
//             ]}
//           >
//             Drivers
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Add Button */}
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() =>
//           activeTab === "cars"
//             ? setCarModalVisible(true)
//             : setDriverModalVisible(true)
//         }
//       >
//         <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
//         <Text style={styles.addButtonText}>
//           Add {activeTab === "cars" ? "Vehicle" : "Driver"}
//         </Text>
//       </TouchableOpacity>

//       {/* List */}
//       <FlatList
//         data={activeTab === "cars" ? cars : drivers}
//         renderItem={activeTab === "cars" ? renderCar : renderDriver}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContainer}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No {activeTab} added yet</Text>
//         }
//       />

//       {/* Forms */}
//       <CarForm
//         visible={carModalVisible}
//         onClose={() => setCarModalVisible(false)}
//         onSubmit={({ carData, resetCarData }) =>
//           // Handle car submission
//           handleAddCar({ carData, resetCarData })
//         }
//         loading={loading}
//       />

//       <DriverForm
//         visible={driverModalVisible}
//         onClose={() => setDriverModalVisible(false)}
//         onSubmit={({ driverData, resetDriverData }) =>
//           // Handle car submission
//           handleAddDriver({ driverData, resetDriverData })
//         }
//         loading={loading}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   tabContainer: {
//     flexDirection: "row",
//     padding: 16,
//     backgroundColor: "#FFFFFF",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 8,
//     alignItems: "center",
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: "#3B82F6",
//   },
//   tabText: {
//     fontSize: 16,
//     color: "#6B7280",
//     fontWeight: "500",
//   },
//   activeTabText: {
//     color: "#3B82F6",
//   },
//   addButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#3B82F6",
//     padding: 12,
//     margin: 16,
//     borderRadius: 8,
//     justifyContent: "center",
//   },
//   addButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "500",
//     marginLeft: 8,
//   },
//   listContainer: {
//     padding: 16,
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   cardContent: {
//     gap: 4,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#111827",
//   },
//   cardSubtitle: {
//     fontSize: 16,
//     color: "#4B5563",
//   },
//   cardDetail: {
//     fontSize: 14,
//     color: "#6B7280",
//   },
//   deleteButton: {
//     padding: 4,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     padding: 16,
//   },
//   modalContent: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 16,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 16,
//     color: "#111827",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     fontSize: 16,
//     color: "#111827",
//   },
//   modalButtons: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 12,
//     marginTop: 16,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     marginBottom: 12,
//     backgroundColor: "#FFFFFF",
//   },
//   picker: {
//     height: 50,
//     width: "100%",
//   },
//   button: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//   },
//   cancelButton: {
//     backgroundColor: "#F3F4F6",
//   },
//   submitButton: {
//     backgroundColor: "#3B82F6",
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#4B5563",
//   },
//   submitButtonText: {
//     color: "#FFFFFF",
//   },
//   emptyText: {
//     textAlign: "center",
//     color: "#6B7280",
//     fontSize: 16,
//     marginTop: 24,
//   },
//   imagePickerButton: {
//     width: "100%",
//     height: 200,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderStyle: "dashed",
//     marginBottom: 16,
//     overflow: "hidden",
//   },
//   imagePlaceholder: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   imagePlaceholderText: {
//     color: "#9CA3AF",
//     marginTop: 8,
//   },
//   pickedImage: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
//   carImage: {
//     width: "100%",
//     height: 150,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//     marginBottom: 12,
//   },
// });

// export default FleetManagementScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  query,
  getDocs,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import DB, { authFirebase, storage } from "../../database/firebaseConfig";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import DropDownPicker from "react-native-dropdown-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { LinearGradient } from 'expo-linear-gradient';

const CAR_TYPES = [
  { label: "Select a vehicle type", value: "" },
  { label: "Cargo Van", value: "Cargo Van" },
  { label: "Flabbed", value: "Flabbed" },
  { label: "Small Trucks-16ft", value: "Small Trucks-16ft" },
  { label: "Refrigerated", value: "Refrigerated" },
  { label: "Medium Box-20ft", value: "Medium Box-20ft" },
  { label: "Large Box-26ft", value: "Large Box-26ft" },
];

const StatusChip = ({ label, status }) => (
  <View style={[styles.chip, status && styles.activeChip]}>
    <Text style={[styles.chipText, status && styles.activeChipText]}>{label}</Text>
  </View>
);

const DriverForm = ({ visible, onClose, onSubmit, loading }) => {
    const { user } = useUser();
    const [driverData, setDriverData] = useState({
      name: "",
      phone: "",
      email: "",
      company: user.username,
      cnic: "",
      model: "",
      licenseUrl: "",
      address: "",
      age: "",
    });
    const [imageLoading, setImageLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(CAR_TYPES);
  
    const pickImage = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        console.log(result.assets[0].uri);
  
        // if (!result.canceled) {
        setDriverData((prev) => ({
          ...prev,
          licenseUrl: result.assets[0].uri,
        }));
        // }
      } catch (error) {
        Alert.alert("Error", "Failed to pick image");
      }
    };
    const updateField = (field, value) => {
      setDriverData((prev) => ({ ...prev, [field]: value }));
    };
  
    const resetDriverData = () => {
      setDriverData({
        name: "",
        email: "",
        phone: "",
        company: "",
        cnic: "",
        model: "",
        licenseUrl: "",
        address: "",
        age: "",
      });
    };
  
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Driver</Text>
            {/* Image Picker */}
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImage}
            >
              {driverData.licenseUrl ? (
                <Image
                  source={{ uri: driverData.licenseUrl }}
                  style={styles.pickedImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialCommunityIcons
                    name="camera-plus"
                    size={40}
                    color="#9CA3AF"
                  />
                  <Text style={styles.imagePlaceholderText}>
                    Add Driving License
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              onChangeText={(text) =>
                setDriverData((prev) => ({ ...prev, name: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              onChangeText={(text) =>
                setDriverData((prev) => ({ ...prev, email: text }))
              }
            />
  
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setDriverData((prev) => ({ ...prev, phone: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="CNIC"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setDriverData((prev) => ({ ...prev, cnic: text }))
              }
            />
  
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="#9CA3AF"
            />
  
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
  
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={() => onSubmit({ driverData, resetDriverData })}
                disabled={loading}
              >
                <Text style={[styles.buttonText, styles.submitButtonText]}>
                  {loading ? "Adding..." : "Add Driver"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

// Car Form Component
const CarForm = ({ visible, onClose, onSubmit, loading }) => {
  // ... (Keep existing form state and functions)
  const { user } = useUser();
    const [carData, setCarData] = useState({
      carName: "",
      carType: "",
      company: user.username,
      fare: "",
      model: "",
      licensePlate: "",
      year: "",
      carImage: "",
    });
    const [imageLoading, setImageLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(CAR_TYPES);
  
    const pickImage = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        console.log(result.assets[0].uri);
  
        // if (!result.canceled) {
        setCarData((prev) => ({
          ...prev,
          carImage: result.assets[0].uri,
        }));
        // }
      } catch (error) {
        Alert.alert("Error", "Failed to pick image");
      }
    };
    const updateField = (field, value) => {
      setCarData((prev) => ({ ...prev, [field]: value }));
    };
  
    const resetCarData = () => {
      setCarData({
        carName: "",
        carType: "",
        company: "",
        fare: "",
        model: "",
        licensePlate: "",
        year: "",
        carImage: "",
      });
    };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8f9fa']}
          style={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Add New Vehicle</Text>

          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            {carData.carImage ? (
              <Image source={{ uri: carData.carImage }} style={styles.pickedImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialCommunityIcons name="camera-plus" size={40} color="#9CA3AF" />
                <Text style={styles.imagePlaceholderText}>Add Vehicle Image</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Keep existing form fields but with updated styles */}
          <TextInput
            style={styles.modernInput}
            placeholder="Car Name"
            placeholderTextColor="#9CA3AF"
            value={carData.carName}
            onChangeText={(text) => setCarData((prev) => ({ ...prev, carName: text }))}
          />
          {/* ... Other inputs ... */}

                   {/* Car Type Dropdown */}
           <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={open}
              value={carData.carType}
              items={items}
              setOpen={setOpen}
              setValue={(callback) => {
                if (typeof callback === "function") {
                  const value = callback(carData.carType);
                  updateField("carType", value);
                } else {
                  updateField("carType", callback);
                }
              }}
              setItems={setItems}
              placeholder="Select vehicle type"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownList}
              placeholderStyle={styles.dropdownPlaceholder}
              listItemContainerStyle={styles.dropdownListItem}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Fare"
            value={carData.fare}
            onChangeText={(text) =>
              setCarData((prev) => ({ ...prev, fare: text }))
            }
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            style={styles.input}
            placeholder="Vehicle Model"
            value={carData.model}
            onChangeText={(text) =>
              setCarData((prev) => ({ ...prev, model: text }))
            }
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            style={styles.input}
            placeholder="License Plate"
            value={carData.licensePlate}
            onChangeText={(text) =>
              setCarData((prev) => ({ ...prev, licensePlate: text }))
            }
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            style={styles.input}
            placeholder="Year"
            value={carData.year}
            onChangeText={(text) =>
              setCarData((prev) => ({ ...prev, year: text }))
            }
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={() => onSubmit({ carData, resetCarData })}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={[styles.buttonText, styles.submitButtonText]}>
                  Add Vehicle
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

// Driver Form Component (similar updates as CarForm)
// ... 

const VehicleCard = ({ item, onDelete }) => (
  <LinearGradient
    colors={['#ffffff', '#f8f9fa']}
    style={styles.modernCard}
  >
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderLeft}>
        <MaterialCommunityIcons name="truck" size={24} color="#4B5563" />
        <Text style={styles.cardTitle}>{item.carName}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(item.id, "car")}>
        <MaterialCommunityIcons name="delete" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>

    <View style={styles.cardBody}>
      <Image source={{ uri: item.imageUrl}} style={styles.vehicleImage} />
      
      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <StatusChip label={item.carType} status={true} />
          <StatusChip label={`$${item.fare}/hr`} status={true} />
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="license" size={20} color="#6B7280" />
            <Text style={styles.detailText}>{item.licensePlate}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#6B7280" />
            <Text style={styles.detailText}>{item.year}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="office-building" size={20} color="#6B7280" />
            <Text style={styles.detailText}>{item.company}</Text>
          </View>
        </View>
      </View>
    </View>
  </LinearGradient>
);

const DriverCard = ({ item, onDelete }) => (
  <LinearGradient
    colors={['#ffffff', '#f8f9fa']}
    style={styles.modernCard}
  >
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderLeft}>
        <MaterialCommunityIcons name="account" size={24} color="#4B5563" />
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(item.id, "driver")}>
        <MaterialCommunityIcons name="delete" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>

    <View style={styles.cardBody}>
      <Image 
        source={{ uri: item.licenseUrl || 'https://via.placeholder.com/150' }} 
        style={styles.driverImage} 
      />
      
      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <StatusChip label={item.isAvailable ? "Available" : "Busy"} status={item.isAvailable} />
        </View>
        
        <View style={[styles.detailsContainer,{left:-12}]}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="phone" size={20} color="#6B7280" />
            <Text style={styles.detailText}>{item.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="email" size={20} color="#6B7280" />
            <Text style={styles.detailText}>{item.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="card-account-details" size={20} color="#6B7280" />
            <Text style={styles.detailText}>{item.cnic}</Text>
          </View>
        </View>
      </View>
    </View>
  </LinearGradient>
);

const FleetManagementScreen = () => {
  // ... (Keep existing state and functions)
  const [activeTab, setActiveTab] = useState("cars");
    const [cars, setCars] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [carModalVisible, setCarModalVisible] = useState(false);
    const [driverModalVisible, setDriverModalVisible] = useState(false);
    const { isLoaded, signUp, setActive } = useSignUp();
    const { user } = useUser();
    let moverId;
    useEffect(() => {
      fetchMoverData();
    }, []);
  
    const fetchMoverData = async () => {
      if (user) {
        try {
          const q = query(
            collection(DB, "companies"),
            where("username", "==", user?.username)
          );
          const querySnapshot = await getDocs(q);
  
          const moverData = [];
          querySnapshot.forEach((doc) => {
            // Append the document data to the moverData array
            moverData.push({ id: doc.id, ...doc.data() });
            console.log(doc.id, " => ", doc.data());
          });
          moverId = querySnapshot.docs[0].id;
          if (moverData.length > 0) {
            // Assuming you only expect one matching document
            console.log(querySnapshot.docs[0].id);
          } else {
            console.log("No matching company found");
          }
  
          await fetchData();
        } catch (error) {
          console.error("Error fetching mover data:", error);
        }
      }
    };
    const fetchData = async () => {
      try {
        setLoading(true);
        const carsQuery = query(
          collection(DB, "cars"),
          where("company", "==", user.username)
        );
        const driversQuery = query(
          collection(DB, "drivers"),
          where("company", "==", user.username)
        );
  
        const [carsSnapshot, driversSnapshot] = await Promise.all([
          getDocs(carsQuery),
          getDocs(driversQuery),
        ]);
  
        setCars(carsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setDrivers(
          driversSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        Alert.alert("Error", "Failed to fetch data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const handleAddCar = async ({ carData, resetCarData }) => {
      if (!carData.carImage) {
        console.error("Invalid car data:");
        return;
      }
  
      try {
        setLoading(true);
  
        let imageUrl = null;
        if (carData.carImage) {
          const imageRef = ref(
            storage,
            `car-images/${moverId || user.username}/${Date.now()}.jpg`
          );
          const response = await fetch(carData?.carImage);
          const blob = await response.blob();
          await uploadBytes(imageRef, blob);
          imageUrl = await getDownloadURL(imageRef);
        }
        console.log(imageUrl);
        console.log(carData);
  
        const carRef = collection(DB, "cars");
        const newCar = {
          carName: carData.carName || "",
          carType: carData.carType || "",
          company: user.username || "",
          fare: parseFloat(carData.fare) || 0,
          model: carData.model || "",
          licensePlate: carData.licensePlate || "",
          year: carData.year || "",
          imageUrl: imageUrl || "",
          
        };
        try {
          const docRef = await addDoc(carRef, newCar);
          console.log("Car added with ID:", docRef.id);
        } catch (error) {
          console.log("error while addDoc method" + error);
        }
        // setCars(prev => [...prev, { id: docRef.id, ...newCar }]);
        setCarModalVisible(false);
        resetCarData();
        fetchData();
        Alert.alert("Success", "Vehicle added successfully");
      } catch (error) {
        console.error("Error adding car:" + error);
        Alert.alert("Error", "Failed to add vehicle");
      } finally {
        setLoading(false);
      }
    };
  
    const handleSignUp = async (driverData) => {
      try {
        // Check if email exists in Firestore
        const driverQuery = query(
          collection(DB, "drivers"),
          where("email", "==", driverData.email)
        );
        const driverSnapshot = await getDocs(driverQuery);
  
        if (!driverSnapshot.empty) {
          Alert.alert(
            "Error",
            "Email already exists. Please use a different email."
          );
          return;
        }
  
        const { user } = await createUserWithEmailAndPassword(
          authFirebase,
          driverData.email,
          "123456789" // Ideally, let the driver set their password or generate one.
        );
  
        console.log("Driver created:", user);
        return user.uid;
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert(
            "Error",
            "Email is already associated with another account."
          );
        } else if (error.code === "auth/invalid-email") {
          Alert.alert("Error", "Invalid email address.");
        } else {
          Alert.alert("Error", "Failed to sign up the driver. Please try again.");
        }
        console.error(error);
        return null;
      }
    };
    const handleAddDriver = async ({ driverData, resetDriverData }) => {
      try {
        setLoading(true);
  
        // Sign up the driver and get the UID
        const uid = await handleSignUp(driverData);
        if (!uid) {
          setLoading(false);
          return;
        }
  
        let imageUrl = null;
        if (driverData.licenseUrl) {
          const imageRef = ref(
            storage,
            `driver-images/${moverId || user.username}/${Date.now()}.jpg`
          );
          const response = await fetch(driverData?.licenseUrl);
          const blob = await response.blob();
          await uploadBytes(imageRef, blob);
          imageUrl = await getDownloadURL(imageRef);
        }
  
        const driverRef = collection(DB, "drivers");
        const newDriver = {
          driver_uid: uid,
          isAvailable: true,
          name: driverData.name || "",
          phone: driverData.phone || "",
          email: driverData.email || "",
          company: user.username || "",
          address: driverData.address || "",
          cnic: driverData.cnic || "",
          licenseUrl: imageUrl || "",
          createdAt: new Date(),
        };
  
        await addDoc(driverRef, newDriver);
        console.log("Driver added successfully:", newDriver);
  
        setDriverModalVisible(false);
        resetDriverData();
        fetchData();
        Alert.alert("Success", "Driver added successfully.");
      } catch (error) {
        console.error("Error adding driver:", error);
        Alert.alert("Error", "Failed to add driver. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    const handleDelete = (id, type) => {
      Alert.alert(
        "Confirm Delete",
        `Are you sure you want to delete this ${type}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteDoc(doc(DB, `${type}s`, id));
                if (type === "car") {
                  setCars(cars.filter((car) => car.id !== id));
                } else {
                  setDrivers(drivers.filter((driver) => driver.id !== id));
                }
              } catch (error) {
                Alert.alert("Error", `Failed to delete ${type}`);
              }
            },
          },
        ]
      );
    };
  
    
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8f9fa', '#ffffff']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Fleet Management</Text>
        </View>

        <View style={styles.modernTabContainer}>
          <TouchableOpacity
            style={[styles.modernTab, activeTab === "cars" && styles.activeModernTab]}
            onPress={() => setActiveTab("cars")}
          >
            <MaterialCommunityIcons 
              name="truck" 
              size={24} 
              color={activeTab === "cars" ? "#3B82F6" : "#6B7280"} 
            />
            <Text style={[styles.modernTabText, activeTab === "cars" && styles.activeModernTabText]}>
              Vehicles
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modernTab, activeTab === "drivers" && styles.activeModernTab]}
            onPress={() => setActiveTab("drivers")}
          >
            <MaterialCommunityIcons 
              name="account-group" 
              size={24} 
              color={activeTab === "drivers" ? "#3B82F6" : "#6B7280"} 
            />
            <Text style={[styles.modernTabText, activeTab === "drivers" && styles.activeModernTabText]}>
              Drivers
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.modernAddButton}
          onPress={() => activeTab === "cars" ? setCarModalVisible(true) : setDriverModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
          <Text style={styles.modernAddButtonText}>
            Add {activeTab === "cars" ? "Vehicle" : "Driver"}
          </Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <FlatList
            data={activeTab === "cars" ? cars : drivers}
            renderItem={({ item }) => 
              activeTab === "cars" 
                ? <VehicleCard item={item} onDelete={handleDelete} />
                : <DriverCard item={item} onDelete={handleDelete} />
            }
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyStateContainer}>
                <MaterialCommunityIcons 
                  name={activeTab === "cars" ? "truck-minus" : "account-question"} 
                  size={48} 
                  color="#9CA3AF" 
                />
                <Text style={styles.emptyStateText}>
                  No {activeTab} added yet
                </Text>
              </View>
            }
          />
        )}

        <CarForm
          visible={carModalVisible}
          onClose={() => setCarModalVisible(false)}
          onSubmit={handleAddCar}
          loading={loading}
        />

        <DriverForm
          visible={driverModalVisible}
          onClose={() => setDriverModalVisible(false)}
          onSubmit={handleAddDriver}
          loading={loading}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
    backgroundColor: "#F9FAFB",
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  modernTabContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modernTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  activeModernTab: {
    backgroundColor: "#EBF5FF",
    borderRadius: 8,
  },
  modernTabText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeModernTabText: {
    color: "#3B82F6",
  },
  modernAddButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modernAddButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modernCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  cardBody: {
    flexDirection: "row",
    gap: 16,
  },
  vehicleImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  driverImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  activeChip: {
    backgroundColor: "#EBF5FF",
  },
 chipText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    activeChipText: {
        color: "#3B82F6",
    },
    detailsContainer: {
    
        gap: 8,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        // flexWrap:'wrap'
    },
    detailText: {
        fontSize: 14,
        color: "#6B7280",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    emptyStateText: {
        fontSize: 16,
        color: "#9CA3AF",
        marginTop: 8,
    },
    listContainer: {
        padding: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 16,
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#111827",
    },
    modernInput: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
        color: "#111827",
        backgroundColor: "#F9FAFB",
    },
    imagePickerButton: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#E5E7EB",
        borderStyle: "dashed",
        marginBottom: 20,
        overflow: "hidden",
        backgroundColor: "#F9FAFB",
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
    },
      input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#111827",
  },
    imagePlaceholderText: {
        color: "#9CA3AF",
        marginTop: 8,
        fontSize: 16,
    },
    pickedImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 20,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120,
    },
    cancelButton: {
        backgroundColor: "#F3F4F6",
    },
    submitButton: {
        backgroundColor: "#3B82F6",
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6B7280",
    },
    submitButtonText: {
        color: "#FFFFFF",
    },
    dropdownContainer: {
        marginBottom: 16,
        zIndex: 1000,
    },
    dropdown: {
        borderColor: "#E5E7EB",
        borderRadius: 12,
        backgroundColor: "#F9FAFB",
    },
    dropdownText: {
        fontSize: 16,
        color: "#111827",
    },
    dropdownList: {
        borderColor: "#E5E7EB",
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dropdownPlaceholder: {
        color: "#9CA3AF",
    },
    dropdownListItem: {
        padding: 12,
    },
});

export default FleetManagementScreen;