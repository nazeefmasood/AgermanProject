import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet ,View,Text} from 'react-native';
import { TextInput, Button, Avatar, Appbar } from 'react-native-paper';
import {  Card, Title, Paragraph } from 'react-native-paper';

const EditUserProfile = () => {
    const {userId} =useLocalSearchParams()
    
console.log(userId);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    imageUrl: '',
    joinedAt:'',
    lastActive:'',
    lastSignIn:'',
  });
const key ='sk_test_CPes7EdioH5zt6FigGv5cN9hovQextyohqQam2xwAB';
  const fetchUserData = async () => {
    try {
        const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization':`Bearer ${key}` , // Replace with your actual API key or JWT
              'Content-Type': 'application/json',
            },
          });
      const user = await response.json();
      console.log(user);
      
      setUserData({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email_addresses[0]?.email_address,
        role: user.unsafe_metadata.role,
        imageUrl: user.image_url,
        joinedAt:user.created_at,
        lastActive:user.last_active_at,
        lastSignIn:user.last_sign_in_at,
        
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      await fetch(`YOUR_API_ENDPOINT/users/${userId}`, {
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

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Avatar.Image 
        size={120} 
        source={{ uri: userData.imageUrl }} 
        style={styles.avatar} 
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

export default EditUserProfile;
