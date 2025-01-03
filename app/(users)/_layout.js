import { Stack, usePathname } from 'expo-router'
import { Drawer} from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React, { useEffect } from 'react'
import { View,StyleSheet,Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';



const CustomDrawerContent = (props) => {
  const pathname =usePathname();
  const {user}=useUser()
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);



  return (

    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoWrapper}>
       
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>{user?.firstName+" "+user?.lastName}</Text>
          <Text style={styles.userEmail}>{user?.emailAddresses[0].emailAddress}</Text>
        </View>
      </View>
      
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="list"
            size={size}
            color={pathname == "/(tabs)" ? "#fff" : "#000"}
          />
        )}
        label={"Home"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == '/(tabs)' ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == '/(tabs)' ? "#333" : "#fff" }}
        onPress={() => {
          router.push("UserHomePage");
        }} 
      />
      {/* <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="list"
            size={size}
            color={pathname == "../Profile/Profile" ? "#fff" : "#000"}
          />
        )}
        label={"Profile"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "../Profile/Profile" ? "#fff" : "#000" },
        ]}
        
        style={{ backgroundColor: pathname == "../Profile/Profile" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("Profile")
        }} 
      /> */}
      
     
      
    </DrawerContentScrollView>
  );
};
const Layout = () => {
  return (
    <Drawer drawerContent={(props)=> <CustomDrawerContent {...props}/>} screenOptions={{headerShown:false}} >
    

    </Drawer>
  )
}

export default Layout


const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize:16,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  }
});