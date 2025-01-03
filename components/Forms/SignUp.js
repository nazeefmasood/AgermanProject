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
const logo = require("../../assets/images/logo.jpg");
import Spinner from "react-native-loading-spinner-overlay";
import { Stack, router } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { addDoc, collection} from "firebase/firestore"; 
import DB from '../../database/firebaseConfig'
import * as DocumentPicker from 'expo-document-picker';
import { storage } from "../../database/firebaseConfig";
import { ref, uploadBytes,getDownloadURL } from 'firebase/storage';

const SignupForm = () => {
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

  
  
// Movers
const [companyName, setCompanyName] = useState('');
  const [businessLicense, setBusinessLicense] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [yearsInOperation, setYearsInOperation] = useState('');
  const [isLicensed, setIsLicensed] = useState(false);
  const [insuranceDocument, setInsuranceDocument] = useState(null);
  const [businessLicenseDoc, setbusinessLicenseDoc] = useState(null);
  const [businessLicenseURL, setbusinessLicenseURL] = useState('');
  const [insuranceURL, setinsuranceURL] = useState('');
 
 

  

  


  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    
    setLoading(true);

    try {
      if(role=='user'){

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
      }else if(role=='mover'){

        if (!companyName || !businessLicense || !phoneNumber || !email || !isLicensed) {
          alert('Please fill out all required fields and agree to the terms.');
          return;
        }
    
//        const company= verifyCompanyLegitimacy();
//         if(company){
//           alert('Company verification successful.');
//         }else{
// alert('Company verification failed. Please provide valid details.')
//         }

        await signUp
        .create({
          emailAddress:email,
          password:password,
          username:companyName.split(" ").join("").toLowerCase(),
          unsafeMetadata:{
            "role": role,
            "phoneNumber": phoneNumber,
          "website": website,
          "yearsInOperation":yearsInOperation,
          "isLicensed":isLicensed,
          "companyName":companyName,
          "businessLicense":businessLicense,
          },
          
        })

      }
      
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        
      setPendingVerification(true);
      

    } catch (err) {
      alert(err + " onSignUpPress");
    } finally {
      setLoading(false);
    }
  };

  


// const verifyCompanyLegitimacy = async (companyName) => {
//   try {
//     const response = await fetch(`https://api.opencorporates.com/v0.4/companies/search?q=${companyName}`);
//     if (response.data && response.data.results.companies.length > 0) {
//       return response.data.results.companies[0];
//     } else {
//       throw new Error('Company not found');
//     }
//   } catch (error) {
//     console.error('Verification failed:', error);
//     return null;
//   }
// };


  const SaveData=async()=>{
    try {
      if(role == 'user'){

        await addDoc(collection(DB,"users"),{
          FirstName: firstname,
          LastName: lastname,
        email: email,
        role: role,
      })
      
    } else if(role == 'mover'){
      // if(!businessLicenseURL || !insuranceURL){
      //   console.log("businessURL unavailable");
        
      // }
      try {
        console.log("businessLicenseURL: "+businessLicenseURL);
        console.log("InsuranceURL: "+insuranceURL);
        
        await addDoc(collection(DB,"companies"),{
          username:companyName.split(" ").join("").toLowerCase(),
          companyName:companyName,
          phoneNumber: phoneNumber,
          email:email,
          website: website,
          yearsInOperation:yearsInOperation,
          isLicensed:isLicensed,
          businessLicense:businessLicense,
          businessLicenseDoc:businessLicenseURL.toString(),
          insuranceDoc:insuranceURL.toString(),
            })
            console.log("Mover added to firebase database");
            
      } catch (error) {

        console.log("error adding to firebase database"+error.message);
        
      }
    
    }
       
    } catch (e) {
      alert(e+" error");
    }finally {
      setLoading(false);
    }
  }

  const pickDocument = async (setDocument,urltype) => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
       
      });
    
        await setDocument(result);
       
        console.log('Document selected:', );
       
        if (urltype =='businessurl') {
          await uploadDocument(result.assets[0].uri,result.assets[0].name,urltype)
          
          
        }else if (urltype =='insuranceurl'){
          
          await uploadDocument(result.assets[0].uri,result.assets[0].name,urltype)
         
        }
  
        
    } catch (error) {
      console.error('Error picking document:', error);
      alert('Error An error occurred while picking the document.');
    }
  };



  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
       const completeSignUp= await signUp.attemptEmailAddressVerification({
        code: code,
      });
      await setActive({ session: completeSignUp.createdSessionId });
      SaveData()
    } catch (err) {
      alert("Invalid code");
    } 
  };



  const uploadDocument = async (uri, name,urltype) => {
    setLoading(true);
    try {
     
      console.log(uri, name,urltype);
      
      // Create a reference to the file in Firebase Storage
      const fileRef = ref(storage, `CompanyDocs/${companyName}/${name}`);

      // Fetch the file from the local URI
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload the file to Firebase Storage
      await uploadBytes(fileRef, blob);
      
     const url = await getDownloadURL(fileRef)
      console.log(url);
        if (urltype ==='businessurl') {
          setbusinessLicenseURL(url);
          console.log("businessURL"+businessLicenseURL.toString());
          
        }else if (urltype ==='insuranceurl'){
          setinsuranceURL(url)
          console.log("InsuranceURL"+insuranceURL.toString());
        }
      setLoading(false)
    //  return url
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error', 'An error occurred while uploading the document.');
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
        
          <Image source={logo} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>SignUp</Text>
          
          {/* <View style={{flexDirection:'row',justifyContent:'center'}}> */}
            {/* <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
              <Checkbox
                style={{}}
                value={isUserChecked}
                onValueChange={() => {
                  if (isUserChecked == false) {
                    setIsUserChecked(true);
                    setIsDriverChecked(false);
                    setRole("user");
                    // handleState
                  }
                }}
                color={isUserChecked ? "#4630EB" : undefined}
              />
              <Text>User</Text>
            </View>
            <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
              <Checkbox
                style={{}}
                value={isDriverChecked}
                onValueChange={() => {
                  if (isDriverChecked == false) {
                    setIsDriverChecked(true);
                    setIsUserChecked(false);
                    setRole("mover");
                    // handleState
                  }
                }}
                color={isDriverChecked ? "#4630EB" : undefined}
              />
              <Text>Movers</Text>
            </View> */}
            {/* <RadioButton.Group onValueChange={value => setRole(value)} value={role} >
      <RadioButton.Item label="User" value="user" color="white"  style={{borderWidth:1,borderColor:'grey',margin:10,backgroundColor:role=="user"?'lightgreen':null}}/>
      <RadioButton.Item label="Mover" value="mover" style={{borderWidth:1,borderColor:'grey',margin:10}} />
    </RadioButton.Group>
          </View> */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
      <TouchableOpacity
        onPress={() => setRole('user')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'grey',
          padding: 10,
          marginRight: 10,
          backgroundColor: role === 'user' ? 'lightgreen' : 'transparent',
        }}
      >
        <RadioButton
          value="user"
          status={role === 'user' ? 'checked' : 'unchecked'}
          onPress={() => setRole('user')}
          color="white"
        />
        <Text  style={{color:role === 'user' ? 'white' : 'black',fontWeight:'condensedBold',fontSize:16}}>User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setRole('mover')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'grey',
          padding: 10,
          
          backgroundColor: role === 'mover' ? 'lightgreen' : 'transparent',
        }}
      >
        <RadioButton
          value="mover"
          status={role === 'mover' ? 'checked' : 'unchecked'}
          onPress={() => setRole('mover')}
          color="white"
        />
        <Text style={{color:role === 'mover' ? 'white' : 'black',fontWeight:'condensedBold',fontSize:16}}>Mover</Text>
      </TouchableOpacity>
    </View>

                {role=="mover"?
                  <ScrollView contentContainerStyle={{ padding: 20 }}>
                  <View style={{flex:1,flexDirection:'row'}}>

                  <Button mode="outlined" onPress={() => pickDocument(setbusinessLicenseDoc,"businessurl")}>
       
       {businessLicenseDoc?<Text>{businessLicenseDoc.assets[0].name}</Text>:<Text style={{}}>Upload Business License</Text>}
       </Button>
      
 
       <Button mode="outlined" onPress={() => pickDocument(setInsuranceDocument,"insuranceurl")}>
       {insuranceDocument?<Text>{insuranceDocument.assets[0].name}</Text>:<Text>Upload Insurance Document</Text>}
       </Button>
                  </View>
      <TextInput
        label="Company Name"
        value={companyName}
        onChangeText={setCompanyName}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Business License Number"
        value={businessLicense}
        onChangeText={setBusinessLicense}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ marginBottom: 10 }}
      />
      <TextInput
               style={{ marginBottom: 10 }}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              keyboardType="password"
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TextInput
               style={{ marginBottom: 10 }}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmpassword}
              onChangeText={setConfirmpassword}
              autoCorrect={false}
               keyboardType="password"
              autoCapitalize="none"
            />
      <TextInput
        label="Website (Optional)"
        value={website}
        onChangeText={setWebsite}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Years in Operation"
        value={yearsInOperation}
        onChangeText={setYearsInOperation}
        keyboardType="numeric"
        style={{ marginBottom: 10 }}
      />
      
    
      
     


      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Checkbox
          status={isLicensed ? 'checked' : 'unchecked'}
          onPress={() => setIsLicensed(!isLicensed)}
        />
        <Text>I agree to the terms and conditions</Text>
      </View>

    </ScrollView>
                
          :      
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
          
        }

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

export default SignupForm;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios"? 70:50,
  },
  image: {
    height: 180,
    width: 320,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 20,
    color: "green",
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 5,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 7,
  },
  button: {
    backgroundColor: "#34eba4",
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
