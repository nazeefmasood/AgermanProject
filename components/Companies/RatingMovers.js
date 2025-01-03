import React, { useState,useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { collection, query, where, getDocs ,getDoc,updateDoc,doc} from "firebase/firestore";
import DB from '../../database/firebaseConfig';
const StarRating = ({ maxStars = 5,moverId}) => {
  const [rating, setRating] = useState(0);

  const handlePress = async(starIndex) => {
    console.log("Star Index: " + starIndex);
    console.log(moverId);
    
    console.log("New Star rating :",starIndex+1);
    
    try {
      setRating(starIndex + 1)
      // const DocRef = query(collection(DB,"companies"), where("id", "==", moverId));
      const DocRef = doc(DB,"companies",moverId);
      await updateDoc(DocRef, {
        rating: starIndex+1
      });
      console.log("Updated Rating");
      
    } catch (error) {
      console.log("error updating rating"
        +error.message
      );
      
    }
    }


  const fetchMoverRating=async()=>{
    console.log(moverId);
    
      try {
        const q = query(collection(DB,"companies"), where("id", "==", moverId));
        const mover = await getDocs(q);
        
       const moverData= mover.forEach(doc => {

         console.log(doc.data());
         setRating(doc.data().rating);
       })
    
            

      } catch (error) {
        console.log("error rating");
        
      }
  }

  useEffect(() => {
    fetchMoverRating()

  },[handlePress])

  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }, (_, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(index)}>
          <Icon
            name={index < rating ? 'star' : 'star-o'}
            size={30}
            color="#FFD700"
            
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default StarRating;
