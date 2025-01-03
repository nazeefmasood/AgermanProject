import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { useUser } from "@clerk/clerk-expo";
import { PaperProvider } from "react-native-paper";
// MY CODE HERE

const clearSecureStore = async () => {
  try {
    await SecureStore.deleteItemAsync('__clerk_client_jwt');
    console.log('SecureStore cleared successfully.');
  } catch (error) {
    console.error('Error clearing SecureStore:', error);
  }
};

// clearSecureStore();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
console.log(CLERK_PUBLISHABLE_KEY);


const tokenCache = {
  async getToken(key) {  
    try {   
      return SecureStore.getItemAsync(key);  
    } catch (error) {
      return null;  
    }    
  },   
  async saveToken(key, value) {   
    try {       
      return SecureStore.setItemAsync(key, value);    
    } catch (error) {   
      return;  
    }  
  }, 
};
 
const InitialLayout = () => {  
  const { isLoaded, isSignedIn } = useAuth();  
  const segments = useSegments();    
  const router = useRouter();  
  const [isUser, setIsUser] = useState(false);   
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMover, setIsMover] = useState(false);   
  const { user } = useUser();  
     
  const showData = async () => {   
    if (user?.unsafeMetadata.role == "mover") {
      setIsDriver(true);
      setIsUser(false);  
      setIsAdmin(false); 
      setIsDriver(false);
    } else if (user?.unsafeMetadata.role == "user"){
      setIsUser(true);
      setIsDriver(false);
      setIsAdmin(false);
      setIsDriver(false);
    } else if (user?.unsafeMetadata.role == "admin")  {  
      setIsAdmin(true);
      setIsDriver(false);
      setIsUser(false);
      setIsDriver(false);
    }
     else if (user?.unsafeMetadata.role == "driver")  {  
      setIsAdmin(false);
      setIsDriver(false);
      setIsUser(false);
      setIsDriver(true);
    }
  };    

  const inAdminGroup = segments[0] === "(admin)";
  const inUsersGroup = segments[1] === "(users)"; 
  const inMoverGroup = segments[2] === "(mover)";   
  const inDriverGroup = segments[3] === "(driver)";   

  // useEffect(() => {
  //   if (!isLoaded) return;
 
  //   if (isSignedIn) {
  //     showData();
 
  //     if (isDriver && !inDriversGroup) {
  //        router.replace("(driver)/DriversHomePage"); 
  //     }
  //     if (isUser && !inUsersGroup) { 
    
  //        router.replace("(users)/(tabs)/UserHomePage")                                     
  //     }   
  //     if (isAdmin && !inAdminGroup) {  
  //        router.replace("(admin)/AdminHomePage")                    
  //     }   
  //   } else {  
  //     router.replace("/Login");   
  //   } 
      
  // }, [isSignedIn]);     
  useEffect(() => {
    if (!isLoaded) return; 
    console.log(isSignedIn);
    if(isSignedIn==false){
      // Optional: If you want to dismiss all modals/screens
      router.replace("Login"); 
    }      
  
    if (isSignedIn==true) {
      if (user?.unsafeMetadata.role == "mover" && !inMoverGroup) {
        router.replace("MoversHomePage"); 
      } else if (user?.unsafeMetadata.role == "user"  && !inUsersGroup){
        router.replace("UserHomePage")   
      } else if (user?.unsafeMetadata.role == "admin"  && !inAdminGroup)  {  
        router.replace("AdminHomePage") 
      }
       else if (user?.unsafeMetadata.role == "driver"  && !inDriverGroup) {   
        router.replace("driverHome") 
      }

      else{
        router.replace(" Login");   
      }   
    }
      
  }, [isSignedIn]);      
   
  return <Slot />;  
};   
  
const RootLayoutNav = () => {      
  return (     
    <ClerkProvider       
      publishableKey={CLERK_PUBLISHABLE_KEY} 
      tokenCache={tokenCache} 
    >           
      <PaperProvider>    
        <InitialLayout /> 
      </PaperProvider>   
    </ClerkProvider>   
  ); 
}; 
 
export default RootLayoutNav;
        