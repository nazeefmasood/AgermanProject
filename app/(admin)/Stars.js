// import React, { useState } from 'react';
// import { View, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const StarRating = ({ maxStars = 5, onRating }) => {
//   const [rating, setRating] = useState(0);

//   const handlePress = (starIndex) => {
//     setRating(starIndex + 1);
//     if (onRating) {
//       onRating(starIndex + 1);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {Array.from({ length: maxStars }, (_, index) => (
//         <TouchableOpacity key={index} onPress={() => handlePress(index)}>
//           <Icon
//             name={index < rating ? 'star' : 'star-o'}
//             size={30}
//             // color="#FFD700"
//             color="#000"
//           />
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
// });

// export default StarRating;



import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const StarRating = ({ maxStars = 5, moverRating }) => {




  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }, (_, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(index)}>
          <Icon
            name={index < moverRating ? 'star' : 'star-o'}
            size={30}
            // color="#FFD700"
            color="#000"
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
