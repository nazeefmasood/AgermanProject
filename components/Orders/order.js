// // import React, { useState,useEffect } from 'react';
// // import { View, TouchableOpacity, Image, StyleSheet, Pressable ,TextInput, Dimensions, ScrollView} from 'react-native';
// // import { Button, RadioButton, Text } from 'react-native-paper';
// // import * as ImagePicker from 'expo-image-picker';
// // import { Platform } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { addDoc, collection } from 'firebase/firestore';
// // import DB from '../../database/firebaseConfig';
// // import { useUser } from '@clerk/clerk-expo';
// // import { getStorage, ref, uploadBytesResumable,  } from "firebase/storage";
// // import { getDownloadURL } from 'firebase/storage';

// // const Order = () => {
// //     const {user}=useUser()
// //   const [selectedImage, setSelectedImage] = useState("");
// //   const [isFragile, setIsFragile] = useState();
// //   const [length,setLength] = useState();
// //   const [width, setWidth] = useState();
// //   const [height, setheight] = useState();
// //   const [ImageUrl, setImageUrl] = useState();
// // const [name, setName] = useState();
// // const [loading, setLoading] = useState();
// // //   const [selectedImage, setSelectedImage] = useState("");

// //   // Function to handle image selection
// //   const handleImagePicked = async (result) => {
// //     try {
// //       if (!result.cancelled) {
// //         setSelectedImage(result.assets[0].uri);
// //         console.log(result.assets[0].uri);
// //         console.log(selectedImage.name);
// //       }
// //     } catch (error) {
// //       console.log('Error handling image picker:', error);
// //     }
// //   };

// //   // Function to open camera and take picture
// //   const takePicture = async () => {
// //     if (Platform.OS !== 'web') {
// //         const { status } = await ImagePicker.requestCameraPermissionsAsync();
// //         if (status !== 'granted') {
// //           alert('Permission to access camera is required!');
// //         }
// //       }
// //     let result = await ImagePicker.launchCameraAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //       allowsEditing: true,
// //       aspect: [4, 3],
// //       quality: 1,
// //     });

// //     handleImagePicked(result);
// //   };

// //   // Function to open gallery and select image
// //   const pickImage = async () => {
// //     let result = await ImagePicker.launchImageLibraryAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //       allowsEditing: true,
// //       aspect: [16, 9],
// //       quality: 1,
// //     });

// //     handleImagePicked(result);
// //   };

// //   // const addlist = async(event) => {
// //   //   try {
// //   //     console.log(selectedImage.name);
// //   //     let file = selectedImage;

// //   //     const storage = getStorage();
// //   //     var storagePath = 'inventory/' + file;

// //   //     const storageRef = ref(storage, storagePath);
// //   //     const uploadTask = uploadBytesResumable(storageRef, file);

// //   //     uploadTask.on('state_changed', (snapshot) => {
// //   //       // progrss function ....
// //   //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// //   //       console.log('Upload is ' + progress + '% done');
// //   //     },
// //   //     (error) => {
// //   //       // error function ....
// //   //       console.log(error);
// //   //     },
// //   //     () => {
// //   //       // complete function ....
// //   //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
// //   //         console.log('File available at', downloadURL);
// //   //         setImageUrl(downloadURL)
// //   //         addToInventory();
// //   //       });
// //   //     });
// //   //   } catch (error) { throw error;}
// //   // }

// //   const addToInventory=async() => {
// //     try {
// //         if(length==null || width==null){
// //           alert("Please enter details");
// //           return
// //         }
// //         await addDoc(collection(DB,"inventory"),{
// //             name:name,
// //             refId:user?.id,
// //             image:selectedImage,
// //             length:length,
// //             width:width,
// //             area:length*width*height,
// //             isFragile:isFragile,

// //         })
// //         setIsFragile(false);
// //         setLength(null);
// //         setWidth(null);
// //         setSelectedImage(null);
// //     } catch (error) {
// //         console.log(error);
// //     }
// //   }
// //   const removeImage = () => {
// //     console.log('Removing image');
// //     setSelectedImage(null);
// //   };
// //   return (
// //     <ScrollView>

// //     <View style={styles.container}>

// //       <View style={styles.imageContainer} >
// //         {selectedImage ? (
// //             <>
// //             <Pressable
// //              style={styles.closeButton} onPress={removeImage}>
// //               <Ionicons name="close-circle" size={24} color="red" />
// //             </Pressable>
// //           <Image source={{uri:selectedImage}} style={styles.image} />
// //             </>
// //         ) : (
// //             <>

// //           <Button icon="camera" mode="contained" onPress={()=>takePicture()} buttonColor='gray'>
// //             Take Picture
// //           </Button>
// //           <Text>or</Text>
// //           <Button icon="image" mode="contained" onPress={pickImage} buttonColor='gray'>
// //         Insert from gallery
// //       </Button>
// //             </>
// //         )}

// //       </View>
// //       <View style={styles.inputView}>
// //       <Text style={styles.header}>Name</Text>
// //             <TextInput

// //               style={styles.input}

// //               placeholder="chair or table etc"

// //               value={name}
// //               onChangeText={setName}
// //               autoCorrect={false}
// //               autoCapitalize="none"
// //             />

// //           </View>
// //       <Text style={styles.header}>Dimensions</Text>
// //       <View style={styles.inputRow}>
// //       <Text style={styles.header}>Length</Text>
// //             <TextInput
// //               style={styles.Dimensions}
// //               placeholder="Length"
// //               value={length}
// //               onChangeText={setLength}
// //               autoCorrect={false}
// //               autoCapitalize="none"
// //             />
// //       <Text style={styles.header}>Width</Text>
// //             <TextInput
// //               style={styles.Dimensions}
// //               placeholder=" Width"
// //               value={width}
// //               onChangeText={setWidth}
// //               autoCorrect={false}
// //               autoCapitalize="none"
// //             />
// //             </View>
// //       <View style={styles.inputView}>
// //       <Text style={styles.header}>Area</Text>
// //             <TextInput

// //               style={styles.input}
// //               selectTextOnFocus={false}
// //               editable={false}
// //               placeholder={length && width ? length*width +"m^2":"..."}
// //               value={length*width}
// //               aria-disabled={true}
// //               autoCorrect={false}
// //               autoCapitalize="none"
// //             />

// //           </View>
// //           <View >

// //         <Text style={styles.header}>Is Fragile</Text>
// //      <RadioButton.Group style={styles.inputRow} onValueChange={newValue => setIsFragile(newValue)} value={isFragile}>
// //       <View style={styles.inputRow}>
// //         <Text>Yes</Text>
// //         <RadioButton value={true} />

// //         <Text>No</Text>
// //         <View style={{borderWidth:1,marginLeft:10,borderRadius:90,backgroundColor:'none'}}>

// //         <RadioButton value={false} />
// //         </View>
// //       </View>
// //     </RadioButton.Group>
// //           </View>
// //           <Button icon='' onPress={()=>addToInventory()}>Save</Button>
// //     </View>
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     marginTop:40,
// //     alignItems: 'center',
// //     // justifyContent: 'center',
// //     paddingHorizontal: 20,

// //   },
// //   header: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     // marginBottom: 20,
// //   },
// //   imageContainer: {
// //     width: 400,
// //     height: 300,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //    zIndex:-1,
// //     // overflow: 'hidden',
// //     padding: 10, // Padding 10px
// //     backgroundColor: '#d1d1cf', // Background color grey
// //     shadowColor: 'white', // Box shadow color black
// //     shadowOffset: { width:1, height:1 }, // Box shadow offset
// //     shadowOpacity: 1,
// //     // Box shadow opacity
// //     shadowRadius: 1, // Box shadow radius
// //     elevation:5,
// //     borderRadius: 10,
// //     borderWidth: 0,

// //   },
// //   closeButton: {
// //     position: 'absolute',
// //     top: 10,
// //     right: 10,
// //     backgroundColor: 'transparent',
// //     zIndex:9
// //   },
// //   image: {
// //     width: '100%',
// //     height: '100%',
// //     resizeMode: 'contain', // Adjust resizeMode as per your requirement
// //   },
// // inputView: {
// //     gap: 15,
// //     width: "100%",
// //     paddingHorizontal: 40,
// //     marginBottom: 5,
// //   },
// //   input: {
// //     height: 50,
// //     paddingHorizontal: 20,
// //     borderColor: "green",
// //     borderWidth: 1,
// //     borderRadius: 7,
// //   },
// //   inputRow: {
// //     flexDirection: 'row',
// //     alignItems:'center',
// //     justifyContent: 'space-evenly',
// //     margin: 10,
// //   },
// //   Dimensions:{
// //     flex: 1,
// //     height: 50,
// //     borderColor: 'gray',
// //     borderWidth: 1,
// //     margin: 5,
// //     padding: 10,
// //     borderColor: "green",
// //     borderWidth: 1,
// //     borderRadius: 7,
// //   }

// // });

// // export default Order;

// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// const JobListingForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '',
//     email: '',
//     pickupAddress: '',
//     dropoffAddress: '',
//     moveDate: '',
//     moveTime: '',
//     itemsDescription: '',
//     moversRequired: '',
//     specialRequests: '',
//     budget: '',
//     paymentMethod: '',
//     accessRestrictions: '',
//     insurance: '',
//     additionalNotes: '',
//   });
//   const [image, setImage] = useState(null);

//   const handleInputChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = () => {
//     // Handle form submission logic here
//     console.log(formData);
//   };

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
//         {image ? (
//           <Image source={{ uri: image }} style={styles.image} />
//         ) : (
//           <Text style={styles.imagePlaceholder}>Tap to select an image</Text>
//         )}
//       </TouchableOpacity>

//       <Text style={styles.header}>Furniture Moving Job Listing</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Full Name"
//         value={formData.fullName}
//         onChangeText={(text) => handleInputChange('fullName', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         value={formData.phoneNumber}
//         onChangeText={(text) => handleInputChange('phoneNumber', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email Address"
//         value={formData.email}
//         onChangeText={(text) => handleInputChange('email', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Pickup Address"
//         value={formData.pickupAddress}
//         onChangeText={(text) => handleInputChange('pickupAddress', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Drop-off Address"
//         value={formData.dropoffAddress}
//         onChangeText={(text) => handleInputChange('dropoffAddress', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Move Date"
//         value={formData.moveDate}
//         onChangeText={(text) => handleInputChange('moveDate', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Move Time"
//         value={formData.moveTime}
//         onChangeText={(text) => handleInputChange('moveTime', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Description of Items"
//         value={formData.itemsDescription}
//         onChangeText={(text) => handleInputChange('itemsDescription', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Number of Movers Required"
//         value={formData.moversRequired}
//         onChangeText={(text) => handleInputChange('moversRequired', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Special Requests"
//         value={formData.specialRequests}
//         onChangeText={(text) => handleInputChange('specialRequests', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Budget"
//         value={formData.budget}
//         onChangeText={(text) => handleInputChange('budget', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Payment Method"
//         value={formData.paymentMethod}
//         onChangeText={(text) => handleInputChange('paymentMethod', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Access Restrictions"
//         value={formData.accessRestrictions}
//         onChangeText={(text) => handleInputChange('accessRestrictions', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Insurance"
//         value={formData.insurance}
//         onChangeText={(text) => handleInputChange('insurance', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Additional Notes"
//         value={formData.additionalNotes}
//         onChangeText={(text) => handleInputChange('additionalNotes', text)}
//       />

//       <Button title="Submit" onPress={handleSubmit} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//   },
//   imagePicker: {
//     marginBottom: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     height: 200,
//     width: '100%',
//   },
//   image: {
//     height: '100%',
//     width: '100%',
//     resizeMode: 'cover',
//   },
//   imagePlaceholder: {
//     color: '#aaa',
//     textAlign: 'center',
//     lineHeight: 200,
//   },
// });

// export default JobListingForm;

// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// const JobListingForm = () => {

//   const GOOGLE_API_KEY=process.env.EXPO_PUBLIC_GOOGLE_API_KEY
//   console.log("GOOGLE_KEY"+GOOGLE_API_KEY);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '',
//     email: '',
//     pickupAddress: '',
//     dropoffAddress: '',
//     moveDate: '',
//     moveTime: '',
//     itemsDescription: '',
//     moversRequired: '',
//     specialRequests: '',
//     budget: '',
//     paymentMethod: '',
//     accessRestrictions: '',
//     insurance: '',
//     additionalNotes: '',
//   });
//   const [image, setImage] = useState(null);

//   const handleInputChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = () => {
//     console.log(formData);
//   };

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   return (

//     <ScrollView style={styles.container}>
//       <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
//         {image ? (
//           <Image source={{ uri: image }} style={styles.image} />
//         ) : (
//           <Text style={styles.imagePlaceholder}>Tap to select an image</Text>
//         )}
//       </TouchableOpacity>

//       <Text style={styles.header}>Furniture Moving Job Listing</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Full Name"
//         value={formData.fullName}
//         onChangeText={(text) => handleInputChange('fullName', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         value={formData.phoneNumber}
//         onChangeText={(text) => handleInputChange('phoneNumber', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email Address"
//         value={formData.email}
//         onChangeText={(text) => handleInputChange('email', text)}
//       />

//       <GooglePlacesAutocomplete
//         placeholder="Pickup Address"
//         onPress={(data, details = null) => {

//           handleInputChange('pickupAddress'+data.description);
//           console.log(data, details);
//         }}
//         query={{
//           key: GOOGLE_API_KEY, // Replace with your Google API Key
//           language: 'en',
//         }}
//          currentLocation={true}
//         currentLocationLabel='Current location'
//         styles={{
//           textInput: styles.input,
//         }}
//       />

//       <GooglePlacesAutocomplete
//         placeholder="Drop-off Address"
//         onPress={(data, details = null) => {
//           handleInputChange('dropoffAddress', data.description);
//         }}
//         query={{
//           key: GOOGLE_API_KEY, // Replace with your Google API Key
//           language: 'en',
//         }}
//         styles={{
//           textInput: styles.input,
//         }}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Move Date"
//         value={formData.moveDate}
//         onChangeText={(text) => handleInputChange('moveDate', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Move Time"
//         value={formData.moveTime}
//         onChangeText={(text) => handleInputChange('moveTime', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Description of Items"
//         value={formData.itemsDescription}
//         onChangeText={(text) => handleInputChange('itemsDescription', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Number of Movers Required"
//         value={formData.moversRequired}
//         onChangeText={(text) => handleInputChange('moversRequired', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Special Requests"
//         value={formData.specialRequests}
//         onChangeText={(text) => handleInputChange('specialRequests', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Budget"
//         value={formData.budget}
//         onChangeText={(text) => handleInputChange('budget', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Payment Method"
//         value={formData.paymentMethod}
//         onChangeText={(text) => handleInputChange('paymentMethod', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Access Restrictions"
//         value={formData.accessRestrictions}
//         onChangeText={(text) => handleInputChange('accessRestrictions', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Insurance"
//         value={formData.insurance}
//         onChangeText={(text) => handleInputChange('insurance', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Additional Notes"
//         value={formData.additionalNotes}
//         onChangeText={(text) => handleInputChange('additionalNotes', text)}
//       />

//       <Button title="Submit" onPress={handleSubmit} />
//     </ScrollView>

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//   },
//   imagePicker: {
//     marginBottom: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     height: 200,
//     width: '100%',
//   },
//   image: {
//     height: '100%',
//     width: '100%',
//     resizeMode: 'cover',
//   },
//   imagePlaceholder: {
//     color: '#aaa',
//     textAlign: 'center',
//     lineHeight: 200,
//   },
// });

// export default JobListingForm;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { storage } from "../../database/firebaseConfig";
import Spinner from "react-native-loading-spinner-overlay";
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams } from "expo-router";


const JobListingForm = ({ proceed }) => {
  let imageUrl = ''
 const { clearData } = useLocalSearchParams()
  const [formData, setFormData] = useState({
    image:imageUrl||"",
    fullName: "",
    phoneNumber: "",
    email: "",
    pickupLocation: {
      placeId: "",
      latitude: "",
      longitude: "",
      name: "",
      address: "",
    },
    dropoffLocation: {
      placeId: "",
      latitude: "",
      longitude: "",
      name: "",
      address: "",
    },
    moverId: "",
    moveDate: "",
    moveTime: "",
    itemsDescription: "",
    moversRequired: "",
    specialRequests: "",

    accessRestrictions: "",

    additionalNotes: "",
  });
  const [image, setImage] = useState(null);

  const [loading,setLoading] = useState(null);

  // useEffect(() => {
  //   setImage(null);
  // })
  // useEffect(() => {
  //   if(image){
  //     uploadImage()
  //   }
  // },[image])


  useEffect(() => {
    console.log("State has updated:", formData); // This runs after 'state' changes
  }, [formData]);
  // useEffect(() => {
  //   console.log("State has updated:", formData); // This runs after 'state' changes
  // }, [formData]);

  useEffect(() => {
    if (clearData === 'true') {
      setFormData({
        image:"",
        fullName: "",
        phoneNumber: "",
        email: "",
        pickupLocation: { placeId: "", latitude: "", longitude: "", name: "", address: "" },
        dropoffLocation: { placeId: "", latitude: "", longitude: "", name: "", address: "" },
        moverId: "",
        moveDate: "",
        moveTime: "",
        itemsDescription: "",
        moversRequired: "",
        specialRequests: "",
        accessRestrictions: "",
        additionalNotes: "",
      });
      setImage(null);
    }
  }, [clearData]);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
    
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const proceedNext = async() => {
    if (!formData.fullName || formData.fullName.trim() === "") {
      alert("fill all the fields.");
      return
    }
    
setLoading(true)
let downloadURL = ''
    if(!formData.fullName){
      enter
    }
    try {
      
      // uploadImage()
        // setFormData({ ...formData, image:downloadURL});
        // console.log("form"+formData.image);
        
      
      
//     // //     // const licenseRef = ref(storage, `drivers/${name}_license`);
//     // //     // const img = await fetch(licenseImage);
//     // //     // const bytes = await img.blob();
//     // //     // await uploadBytes(licenseRef, bytes);

//     //     const imageRef = ref(storage, `/furnitures/images/fur2_image`);
//     //     const img = await fetch(image);
//     //     const bytes = await img.blob();
//     //      // Unique image name
//     //     await uploadBytes(imageRef, bytes);
//     //     imageUrl = await getDownloadURL(imageRef);
      
proceed(formData);

setLoading(false)
    }catch (error) { 
      console.log(error)
      
    }
//     console.log(formData);
    
    
//     }catch (error) {
// console.log(error);

//     }
console.log("proceeding to next page...");

}




  

  // FOR GETTING DATE  AND TIME
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [Datetext, setDateText] = useState("");
  const [Timetext, setTimeText] = useState("");

  const DateTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    let tempDate = new Date(currentDate);
    if(showDate){

      setDateText(currentDate)
      // setShowDate(false);
      
      setDate(currentDate);
      let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
      setDateText(fDate.toString());
      console.log(fDate.toString()); 
      formData.moveDate = currentDate;
      setShowDate(false)
    }
    if(showTime) {
      
      let fTime = tempDate.getHours() + ": " + tempDate.getMinutes();
      formData.moveTime = fTime;
      
      setTimeText(fTime.toString()); 
      console.log("formdate",formData.moveTime);
      setShowTime(false)
    }

    // setShowDate(false);
    // setShowTime(false);
  }; 

  const showMode = (currentMode) => {
    if (currentMode == "date") {
      setShowDate(true);
      // setShowTime(false);
    } else if (currentMode == "time") {
      setShowTime(true);
      // setShowDate(false);
    }
  };

console.log("date:",Datetext)
  const uploadImage = async () => {
    if (image==null) return;
    
    try {
        if(image){

          const response = await fetch(image)
          const blob = await response.blob();
          const imageName = new Date().getTime() + "_image";  // Unique image name
          
          
          const storageRef = ref(storage, `furniture/images/${imageName}`);
          
          // Upload the image
          const snapshot = await uploadBytes(storageRef, blob);
          imageUrl= await getDownloadURL(snapshot.ref);
          
          console.log(imageUrl);
          
        }
        //  setImage(encodeURIComponent(imageUrl))
          console.log("Image URL ",imageUrl);
          // imageUrl = imageUrl;
          

        console.log(imageUrl);
        
        setFormData((prevData) => ({
          ...prevData,
          image: imageUrl
        }));
      
        return imageUrl;
        
    } catch (error) {
      console.log("upload image method error",error);
      
    }
    // try {
    //   if (image) {
        

    //     // Read the file into a blob
        
    //     const blob = await image.blob();

    //     // Define a unique image name and reference in Firebase Storage
    //     const imageName = new Date().getTime() + "_image";
    //     const storageRef = ref(storage, `images/${imageName}`);

    //     // Upload the blob to Firebase Storage
    //     const snapshot = await uploadBytes(storageRef, blob);

    //     // Get and return the download URL
    //     const downloadUrl = await getDownloadURL(snapshot.ref);
    //     console.log("Download URL:", downloadUrl);
    //     imageUrl = downloadUrl
    //     setLoading(false);
    //     return downloadUrl;
    //   }
    // } catch (error) {
    //   console.log("Upload image method error:", error);
    //   setLoading(false);
    // }
  };



  
  return (
    <View style={styles.container}>
 <Spinner visible={loading} />
    <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Tap to select an image</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.header}>Furniture Moving Job Listing</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(text) => handleInputChange("fullName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChangeText={(text) => handleInputChange("phoneNumber", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Description of Items"
        value={formData.itemsDescription}
        onChangeText={(text) => handleInputChange("itemsDescription", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Movers Required"
        value={formData.moversRequired}
        onChangeText={(text) => handleInputChange("moversRequired", text)}
      />

      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.DateTimeinput}
          editable={false}
          placeholder={String(formData.moveDate)|| "Select a date"}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => showMode("date")}>
          <FontAwesome name="calendar" size={24} color="green" />
        </TouchableOpacity>
      </View>
      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          // timeZoneName={'karachi'}
          display="calender"
          onChange={DateTime}
          style={{ marginLeft: 90 }}
          minimumDate={new Date()}
        />
      )}

      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.DateTimeinput}
          placeholder={String(formData.moveTime) || "Select Time"}
          editable={false}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => showMode("time")}>
          <MaterialCommunityIcons name="clock" size={24} color="green" />
        </TouchableOpacity>
      </View>
      {showTime && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="time"
          is24Hour={true}
          // display="default"
          onChange={DateTime}
          style={{ marginLeft: 90 }}
          minimumDate={new Date()}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Special Requests"
        value={formData.specialRequests}
        onChangeText={(text) => handleInputChange("specialRequests", text)}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Budget"
        value={formData.budget}
        onChangeText={(text) => handleInputChange("budget", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Payment Method"
        value={formData.paymentMethod}
        onChangeText={(text) => handleInputChange("paymentMethod", text)}
      /> */}
      <TextInput
        style={styles.input}
        placeholder="Access Restrictions"
        value={formData.accessRestrictions}
        onChangeText={(text) => handleInputChange("accessRestrictions", text)}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Insurance"
        value={formData.insurance}
        onChangeText={(text) => handleInputChange("insurance", text)}
      /> */}
      <TextInput
        style={styles.input}
        placeholder="Additional Notes"
        value={formData.additionalNotes}
        onChangeText={(text) => handleInputChange("additionalNotes", text)}
      />
 

      <Button title="Submit" onPress={proceedNext} />
  
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  imagePicker: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    height: 200,
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    color: "#aaa",
    textAlign: "center",
    lineHeight: 200,
  },

  //DATE TIME

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 5,
    marginBottom: 10,
  },
  DateTimeinput: {
    flex: 1, // This makes the TextInput take up the remaining space
    height: 40,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default JobListingForm;
