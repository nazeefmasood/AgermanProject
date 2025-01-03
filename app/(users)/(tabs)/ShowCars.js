import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { Card, Chip, Divider, Title } from 'react-native-paper';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import DB from '../../../database/firebaseConfig';

const ShowCars = () => {
  const { companyId, jobId ,username} = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [carsData,setCarsData] = useState([])


  useEffect(() => {
  fetchCarData()
  }, [username])
  
  const carTypes = ['All', 'Cargo Van', 'smallbox', 'small trucks', 'refrigirated', 'flabbed', 'largebox', 'mediumbox'];
  const filteredCars = selectedType === 'All' ? carsData : carsData.filter(car => car.carType === selectedType);

  const AddandProceed = async (item) => {
    try {
      setLoading(true);
      await updateDoc(doc(DB, "furnitureOrders", jobId), {
        carId: item.id,
      });
      router.push({
        pathname: 'FareCalculation',
        params: { companyId, jobId, carId: item.id, carFare: item.fare }
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCarData = async () => {
    try {
      setLoading(true);
      const carsRef = collection(DB, "cars");
      const q = query(carsRef, where("company", "==", username));
      const querySnapshot = await getDocs(q);
      
      const cars = [];
      querySnapshot.forEach((doc) => {
        cars.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setCarsData(cars);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };
  
  const CarCard = ({ item }) => (
    <TouchableOpacity onPress={() => AddandProceed(item)}>
      <Card style={styles.card}>
        <LinearGradient
          colors={['#1a237e', '#3949ab']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientHeader}
        >

        <View style={{display:'flex',justifyContent:'space-between',width:'100%',flexDirection:'row'}}>

          <Text style={styles.cardTitle}>{item.carName}</Text>
            <Chip
              mode="outlined"
              style={styles.typeChip}
              textStyle={styles.chipText}
            >
              {item.type}
            </Chip>
        </View>
        </LinearGradient>
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image source={{uri:item.imageUrl}} style={styles.carImage} />
          </View>
          <View style={styles.cardDetails}>
            <View style={styles.fareContainer}>
              <Text style={styles.fareLabel}>Fare</Text>
              <Text style={styles.fareAmount}>RS {item.fare}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6200ea" />
        </View>
      )}
      
     <View>
      <Title>Select a Car</Title>
     </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={carTypes}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
          renderItem={({ item }) => (
            <Chip
              selected={selectedType === item}
              onPress={() => setSelectedType(item)}
              style={[
                styles.filterChip,
                selectedType === item && styles.selectedChip
              ]}
              textStyle={[
                styles.filterChipText,
                selectedType === item && styles.selectedChipText
              ]}
            >
              {item}
            </Chip>
          )}
        />
      </View>
      
      <FlatList
        data={filteredCars}
        renderItem={CarCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.carList}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingTop:30,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 35, 126, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  filterContainer: {
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  chipContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    marginHorizontal: 4,
    backgroundColor: '#e8eaf6',
    borderColor: '#3949ab',
  },
  selectedChip: {
    backgroundColor: '#3949ab',
  },
  filterChipText: {
    color: '#3949ab',
  },
  selectedChipText: {
    color: '#fff',
  },
  carList: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  gradientHeader: {
    padding: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
  },
  carImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    objectFit: 'contain',
  },
  cardDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  typeChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8eaf6',
    borderColor: '#3949ab',
  },
  chipText: {
    color: '#3949ab',
    fontSize: 12,
  },
  fareContainer: {
    backgroundColor: '#e8eaf6',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    flex:1,
    justifyContent: 'center',
    
  },
  fareLabel: {
    color: '#3949ab',
    fontSize: 12,
    fontWeight: '500',
  },
  fareAmount: {
    color: '#1a237e',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ShowCars;