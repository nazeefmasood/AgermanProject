// import React, { useState, useRef } from 'react';
// import { View, Text, StyleSheet, Animated, TouchableOpacity, PanResponder } from 'react-native';
// import { useRouter } from 'expo-router';

// const NotificationScreen = ({ isVisible, onClose }) => {
//   const slideAnim = useRef(new Animated.Value(300)).current;

//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: Animated.event([null, { dx: slideAnim }], { useNativeDriver: false }),
//       onPanResponderRelease: (evt, { dx }) => {
//         if (dx > 100) {
//           onClose();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: false,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   React.useEffect(() => {
//     if (isVisible) {
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         useNativeDriver: false,
//       }).start();
//     } else {
//       Animated.spring(slideAnim, {
//         toValue: 400,
//         useNativeDriver: false,
//       }).start();
//     }
//   }, [isVisible]);

//   if (!isVisible) return null;

//   return (
//     <Animated.View
//       style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}
//       {...panResponder.panHandlers}
//     >
//       <TouchableOpacity onPress={onClose}>
//         <Text style={styles.closeButton}>Close</Text>
//       </TouchableOpacity>
//       <Text style={styles.text}>Notifications</Text>
//       {/* Render your notifications here */}
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   modal: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     bottom: 0,
//     width: 300,
//     backgroundColor: 'white',
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: -2, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   closeButton: {
//     fontSize: 16,
//     color: 'blue',
//     textAlign: 'right',
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default NotificationScreen;


import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, PanResponder } from 'react-native';

const NotificationScreen = ({ isVisible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(300)).current; // Start off-screen (300 is the width)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: slideAnim }], { useNativeDriver: false }),
      onPanResponderRelease: (evt, { dx }) => {
        if (dx > 100) { // If swiped more than 100px
          Animated.timing(slideAnim, {
            toValue: 300, // Move it completely off the screen
            duration: 300,
            useNativeDriver: false,
          }).start(onClose); // Call onClose after animation
        } else {
          Animated.spring(slideAnim, {
            toValue: 0, // Snap back to the original position
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}
      {...panResponder.panHandlers}
    >
      {/* <TouchableOpacity onPress={onClose}>
        <Text style={styles.closeButton}>Close</Text>
      </TouchableOpacity> */}
      <Text style={styles.text}>Notifications</Text>
      {/* Render your notifications here */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 300,
    backgroundColor: 'whitesmoke',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  closeButton: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'right',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NotificationScreen;
