import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
const logo = require("../../assets/images/logo.jpg")
const DriverSignIn = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const driverList=[]
   const [pendingVerification, setPendingVerification] = useState(false);
     const [code, setCode] = useState("");
     const { isLoaded, signUp, setActive } = useSignUp();
  const theme = useTheme();

  const preAddedDriverDetails=async()=>{
    try {
        const drivers =await fetch("http://192.168.1.45:3000/authentication/drivers",{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
          });
          
          const data = await drivers.json();
          // driverList.push(data);
console.log(data);
          
          
    } catch (error) { 
         
    } 
  } 
  useEffect(() => {
    preAddedDriverDetails()
  
  },[] )


  const handleSignIn = async () => {
    const metadata = {
        addedBy: "", 
        email:"", 
        name:"",
        createdAt: new Date().toISOString(),
        role: "driver",
      };
    setLoading(true);

    try {
      // const drivers = await preAddedDriverDetails(); 
       
      // Check if input matches any pre-added driver details
//       const isDriverValid = driverList.forEach(
//         (driver) => { if(driver?.email == email){
//             metadata.addedBy=driver.company
//             metadata.email=driver.email
//             metadata.name=driver.name
//         return true
//         }}
//       );
// console.log(metadata);

//       if (!isDriverValid) {
//         alert('Access Denied \nThe driver is not authorized.');
//         setLoading(false);
//         return;
//       }


    await signUp
    .create({
      firstName:metadata.name,
      lastName:"",
      emailAddress: metadata.email||email,
      password: "12345678",
      unsafeMetadata:{
        "role": metadata.role,
        "addedBy":metadata.addedBy
      },
      
    })
   
    } catch (error) {
      alert('Sign-In Failed'+error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
{pendingVerification && (
        <View style={{ alignItems: "center", width: 300, paddingTop: 60 }}>
          <Image source={logo} style={styles.image} resizeMode="contain" />
          <View style={styles.inputView}>
            <TextInput
              value={code}
              placeholder="Code..."
              style={styles.input}
              onChangeText={setCode}
            />
          </View>
          {/* <Button onPress={onPressVerify} title="Verify Email" color={'#6c47ff'}></Button> */}
          <View style={styles.buttonView}>
            <Pressable style={styles.button} onPress={() => onPressVerify()}>
              <Text style={styles.buttonText}>Verify Email</Text>
            </Pressable>
          </View>
        </View>
      )}
      <Image
        source={logo} // Replace with your app logo URL
        style={styles.logo}
      />
      <Text style={styles.title}>Driver Sign In</Text>
      <TextInput
        label="Phone Number"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        placeholder="Enter your email or phone number"
        style={styles.input}
        keyboardType="email-address"
      />
      <Button
        mode="contained"
        onPress={handleSignIn}
        style={styles.button}
        loading={loading}
        disabled={loading || email === ''}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
  },
});

export default DriverSignIn;
