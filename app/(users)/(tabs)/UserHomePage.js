import React, { useEffect } from 'react'

import User from '../../../components/HomePages/User';
import DB,{storage} from '../../../database/firebaseConfig';
import { addDoc, collection,doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Asset } from "expo-asset";

const UserHomePage = () => {

 

  return (
<User />
  )
}

export default UserHomePage
