import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc, where, collection, getDocs, query } from 'firebase/firestore';

import DB,{storage} from '../../database/firebaseConfig';
import { useUser } from '@clerk/clerk-expo';

const ProfileUpdateScreen = () => {
  const [formData, setFormData] = useState({
    businessLicense: '',
    companyName: '',
    email: '',
    fareCharge: '',
    isLicensed: false,
    phoneNumber: '',
    profileImage: '',
    rating: 0,
    username: '',
    website: '',
    yearsInOperation: ''
  });
  const [jobId, setJobId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const {user}=useUser()
 
  // Fetch existing profile data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
     
      const companiesCollection = collection(DB, 'companies');
      const q = query(companiesCollection, where("username", "==", user.username));

      // Get the documents
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        console.log("Fetched data:", data);  // Debug log
        
        setFetchingData(prevData => ({
          ...prevData,
          ...data
        }));
        setFormData(prevData => ({
          ...prevData,
          ...data
        })); 
        
        setJobId(doc.id)
        console.log(jobId);
    }} catch (error) {
      console.error('Error fetching profile:'+error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally { 
      setFetchingData(false);
    }
  }; 

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return null;
    
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const filename = `profiles/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async () => {
    if (jobId==null) {
      Alert.alert('Error', 'No document ID found');
      return;
    }

    setLoading(true);
    try {
      // Prepare the update data
      const updateData = {
        ...formData,
        fareCharge: parseFloat(formData.fareCharge) || 0,
        yearsInOperation: parseInt(formData.yearsInOperation) || 0,
        updatedAt: new Date()
      };

      // Handle image upload if there's a new image
      // if (imageUri && imageUri !== formData.profileImage) {
        const imageUrl = await uploadImage(imageUri);
        if (imageUrl) {
          updateData.profileImage = imageUrl;
        }
      // }

      // Update the document
      const companyRef = doc(DB, 'companies', jobId);
      await updateDoc(companyRef, updateData);

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text>Add Photo</Text>
            </View>
          )}
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            value={formData.companyName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, companyName: text }))}
            placeholder="Enter company name"
          />

          <Text style={styles.label}>Business License</Text>
          <TextInput
            style={styles.input}
            value={formData.businessLicense}
            onChangeText={(text) => setFormData(prev => ({ ...prev, businessLicense: text }))}
            placeholder="Enter business license"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            placeholder="Enter email"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
          />

          <Text style={styles.label}>Fare Charge</Text>
          <TextInput
            style={styles.input}
            value={String(formData.fareCharge)}
            onChangeText={(text) => setFormData(prev => ({ ...prev, fareCharge: text }))}
            keyboardType="numeric"
            placeholder="Enter fare charge"
          />

          <Text style={styles.label}>Years in Operation</Text>
          <TextInput
            style={styles.input}
            value={String(formData.yearsInOperation)}
            onChangeText={(text) => setFormData(prev => ({ ...prev, yearsInOperation: text }))}
            keyboardType="numeric"
            placeholder="Enter years in operation"
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
            placeholder="Enter username"
          />

          <Text style={styles.label}>Website</Text>
          <TextInput
            style={styles.input}
            value={formData.website}
            onChangeText={(text) => setFormData(prev => ({ ...prev, website: text }))}
            placeholder="Enter website"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    marginTop: 8,
    color: '#007AFF',
    fontSize: 16,
  },
  inputContainer: {
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileUpdateScreen;