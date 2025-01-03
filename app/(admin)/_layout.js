import { Redirect, Stack, Tabs, router } from 'expo-router';
import { Ionicons,MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAuth} from '@clerk/clerk-expo';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
const AdminTabsPage = () => {
  const {isSignedIn}=useAuth();


  useEffect(() => {

    if(!isSignedIn){
  
      
      router.replace("/public/Login");

    } 

  },[isSignedIn]);
  return (
  <Stack screenOptions={{
    statusBarColor:'secondary',
    headerStyle:{
      backgroundColor:'black', 
      
    },
    headerShown:false,
    headerTintColor:'#fff',
    
  }} initialRouteName='AdminHomePage'>
    <Stack.Screen name='AdminHomePage' options={{
      title: 'Admin',
      
    }} redirect={!isSignedIn} />
    <Stack.Screen name='Users' options={{
      title: 'Manage Users',
      
    }} redirect={!isSignedIn} /> 
    <Stack.Screen name='[userid]' options={{
      title: 'Manage Users',
      
    }} redirect={!isSignedIn} /> 

    <Stack.Screen name='Stats' options={{
      title: 'Orders',
      
    }} redirect={!isSignedIn} /> 

    <Stack.Screen name='ManageMovers' options={{
      title: 'Manage Movers',
      
    }} redirect={!isSignedIn} /> 
    <Stack.Screen name='ShowTransactions' options={{
      title: 'Transactions Details',
      
    }} redirect={!isSignedIn} /> 
    
    {/* <Stack.Screen name='Login' />  */}
  </Stack>
    
  
  );
};

export default AdminTabsPage;