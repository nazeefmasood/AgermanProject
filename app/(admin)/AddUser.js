import React, { useState } from "react";
import {
  
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Platform,
 TouchableOpacity,
  View,
} from "react-native";
// import Checkbox from "expo-checkbox";
import { TextInput, Button, Checkbox, Text,RadioButton } from 'react-native-paper';

import Spinner from "react-native-loading-spinner-overlay";
import { Stack, router } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { addDoc, collection} from "firebase/firestore"; 
import DB from "../../database/firebaseConfig";

const AddUser = () => {
  // User
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();

  



  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    
    setLoading(true);

    try {
  

        await signUp
        .create({
          firstName:firstname,
          lastName:lastname,
          emailAddress: email,
          password: password,
          unsafeMetadata:{
            "role": role
          },
          
        })

        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          
        setPendingVerification(true);

    } catch (err) {
      alert(err + " onSignUpPress");
    } finally {
      setLoading(false);
    }
  };

  



  const SaveData=async()=>{
    try {
        await addDoc(collection(DB,"users"),{
          FirstName: firstname,
          LastName: lastname,
        email: email,
        role: role,
      })
   
       
    } catch (e) {
      alert(e+" error");
    }finally {
      setLoading(false);
    }
  }



  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
       await signUp.attemptEmailAddressVerification({
        code: code,
      });
      SaveData()
    } catch (err) {
      alert("Invalid code");
    } 
  };

  console.log(role);
  return (
    
    
    <SafeAreaView  style={styles.container}>

      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />
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

      {!pendingVerification && (
    <KeyboardAvoidingView behavior={Platform.OS =="ios"? "position":"position"} keyboardVerticalOffset={40}>
        
          <Text style={styles.title}>Add User</Text>
                         
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={firstname}
              onChangeText={setFirstname}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastname}
              onChangeText={setLastname}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmpassword}
              onChangeText={setConfirmpassword}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          

          <View style={styles.buttonView}>
            <Pressable style={styles.button} onPress={onSignUpPress}>
              <Text style={styles.buttonText}>SignUp</Text>
            </Pressable>
          </View>
          
      </KeyboardAvoidingView>
      )}
    </SafeAreaView>
      
   
  );
};

export default AddUser;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios"? 70:50,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 20,
    color: "black",
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 20,
  
  },
  input: {
    height: 50,
    paddingHorizontal: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 7,
  },
  button: {
    backgroundColor: "black",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  buttonG: {
    backgroundColor: "blue",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonView: {
    width: "100%",
    paddingHorizontal: 50,
  },
});
