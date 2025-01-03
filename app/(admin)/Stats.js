import React from 'react';
import { StyleSheet,  View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Text, Title } from 'react-native-paper'
import StarRating from './Stars';

const Stats = () => {
  const handleRating = (rating) => {
    console.log('Rating:', rating);

  };

  
  return (
    <ScrollView>

    <View style={styles.container}>
      <TouchableOpacity style={styles.menuBox} onPress={()=>router.push('/Users' )}>
       <Title style={styles.title}>
        15
       </Title>
        <Text style={styles.info}>Total Users</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
      <Title style={styles.title}>
        15
       </Title>
        <Text style={styles.info}>Toatal Movers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
      <Title style={styles.title}>
        15
       </Title>
        <Text style={styles.info}>Orders Completed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
      <Title style={styles.title}>
        

       </Title>
        <Text style={styles.info}>Best Mover</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/color/70/000000/product.png' }}
        />
        <Text style={styles.info}>Product</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/color/70/000000/traffic-jam.png' }}
        />
        <Text style={styles.info}>Order</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/dusk/70/000000/visual-game-boy.png' }}
        />
        <Text style={styles.info}>Info</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/color/70/000000/user.png' }}
        />
        <Text style={styles.info}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/?size=100&id=XFOumBmRR5zT&format=png&color=000000' }}
        />
        
        <Text style={styles.info}>Review</Text>
      </TouchableOpacity>
    
    </View>
    </ScrollView>
  )
}

export default Stats

const styles = StyleSheet.create({
container: {
    paddingTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  menuBox: {
    // backgroundColor: '#DCDCDC',
    backgroundColor: '#030d1c',
    borderRadius:20,
    width: 180,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
    shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowOffset: { width: 1, height: 2 },
  },
  title: {
    fontSize:58,
    color:'#fff',
    padding:40


  },
  info: {

    fontSize: 22,
    fontWeight:'bold',
    // color: '#696969',
    color:"#fff",
  },

})