// import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
// import { useState } from 'react';
// import { useUser } from '@clerk/clerk-expo';

// const Profile = () => {
//   const { user } = useUser();
//   const [FirstName, setFirstName] = useState();
//   const [LastName, setLastName] = useState();
  
//   const onSaveUser = async () => {
//     try {
//       // This is not working!
//       await user.update({
//         firstName:FirstName,
//         lastName: LastName
//       });
      
//     } catch (e) {
     
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={{ textAlign: 'center' }}>
//         Good morning {user?.firstName+""+user?.lastName}
//       </Text>
        
//       <TextInput placeholder="First Name" value={FirstName} onChangeText={setFirstName} style={styles.inputField} />
//       <TextInput placeholder="Last Name" value={LastName} onChangeText={setLastName} style={styles.inputField} />
//       <Button onPress={onSaveUser} title="Update account" color={'#6c47ff'}></Button>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 40,
//   },
//   inputField: {
//     marginVertical: 4,
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#6c47ff',
//     borderRadius: 4,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
// });

// export default Profile;


import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Avatar, Appbar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import DB, { storage } from '../../../database/firebaseConfig';
// import storage from '@react-native-firebase/storage';
import { ref,  getDownloadURL,uploadBytes, uploadString } from 'firebase/storage';
const Profile = () => {
    
const {user}=useUser()

  const [userData, setUserData] = useState({
    firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        role: user.unsafeMetadata?.role,
        imageUrl: user?.imageUrl,
  });


  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };
  
  const handleUpdate = async () => {
    try {
      await fetch(`https://api.clerk.dev/v1/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      console.log('User data updated successfully');
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };

  
  const pickImage = async () => {
    // Ask the user for permission to access the gallery
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access the gallery is required!');
      return;
    }

    // Let the user pick an image from the gallery
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const selectedImage = pickerResult.assets[0].uri;
      // selectedImage =Platform.OS === 'ios' ? pickerResult.
      console.log(selectedImage);
      const downloadUrl=await uploadImageToFirebase(selectedImage)
      setUserData({ ...userData, imageUrl: downloadUrl });
    }
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error('Error converting URI to Blob'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };
  
  // Function to upload the image to Firebase
  // const uploadImageToFirebase = async (fileUri) => {
  //   try {
  //     console.log('Attempting to convert URI to Blob');
  //     const blob = await uriToBlob(fileUri);
  //     console.log('Blob conversion successful');
  
  //     // Define the storage reference
  //     const storageRef = ref(storage, `images/${Date.now()}.jpg`);
  //     console.log('Blob size:', blob.size);
  //     // Upload the blob
  //     console.log('Uploading blob to Firebase');
      
  //     try {
        
  //       const snapshot = uploadBytes(storageRef, blob);
  //       console.log('Upload successful');
  //       if (!snapshot || !snapshot.ref) {
  //         throw new Error('Invalid snapshot reference');
  //       }
  //       // uploadBytes(storageRef, blob).then(() => {
  //       //   console.log('Uploaded a blob or file!');
  //       // });
  //       try {
        
  //         const downloadUrl = await getDownloadURL(snapshot.ref);
  //         console.log('Download URL retrieved:', downloadUrl);
  //         return downloadUrl;
  //       } catch (error) {
  //         console.log(error);
          
  //       }
  //     } catch (error) {
  //       console.log(error);
        
  //     }
  
      
  
     
  //   } catch (error) {
  //     console.error('Error during upload:', error);
  //     throw error;  // Re-throw the error after logging it
  //   }
  // };
  const uploadImageToFirebase = async (fileUri) => {
    let blob;
  
    // Convert URI to Blob
    try {
      console.log('Attempting to convert URI to Blob');
      blob = await uriToBlob(fileUri);
      console.log('Blob conversion successful');
      console.log('Blob size:', blob.size);
    } catch (error) {
      console.error('Error converting URI to Blob:', error);
      throw error; // Rethrow to handle in the higher scope
    }
  
    let snapshot;
    let storageRef;
    // Upload Blob to Firebase
    try {
      storageRef = ref(storage, `images/${user?.id}.jpg`);
      console.log('Uploading blob to Firebase');
      
    snapshot = await uploadBytes(storageRef, blob);
     console.log('Upload successful');
    
      // snapshot = await uploadBytes(storageRef, blob);
      // console.log('Upload successful');
      // uploadBytes(storageRef, blob).then((snap) => {
      //     console.log('Uploaded a blob or file!');
          
      //   });
    } catch (error) {
      console.error('Error uploading blob to Firebase:', error);
      throw error; // Rethrow to handle in the higher scope
    }
  
    let downloadUrl;
  
    // Get Download URL
    try {
      if (!snapshot || !snapshot.ref) {
        throw new Error('Snapshot reference is invalid or undefined');
      }
  
      downloadUrl = await getDownloadURL(snapshot.ref);
      console.log('Download URL retrieved:', downloadUrl);
    } catch (error) {
      console.error('Error retrieving download URL:', error);
      throw error; // Rethrow to handle in the higher scope
    }
  
    return downloadUrl;
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Avatar.Image
        size={120}
        source={{ uri: userData.imageUrl }}
        style={styles.avatar}
        onTouchEnd={pickImage} // This triggers the image picker when the avatar is tapped
      />
      <TextInput
        label="First Name"
        value={userData.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        value={userData.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={userData.email}
        onChangeText={(text) => handleChange('email', text)}
        mode="outlined"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Role"
        value={userData.role}
        onChangeText={(text) => handleChange('role', text)}
        mode="outlined"
        style={styles.input}
      />
      <Button 
        mode="contained" 
        
        onPress={handleUpdate} 
        style={styles.button}>
        Update
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    flexGrow: 1,
  },
  avatar: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    
  },
});

export default Profile;
