import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Animated, ScrollView } from "react-native";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import DB from "../../../database/firebaseConfig";
import {
  Card, Text, Chip, Searchbar, Portal, Modal, Button,
  ActivityIndicator, Surface, useTheme
} from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';


const AnimatedSurface = Animated.createAnimatedComponent(Surface);

const StarRating = ({ rating }) => {
  const theme = useTheme();
  return (
    <View style={styles.ratingContainer}>
      {[...Array(5)].map((_, i) => (
        <Animated.View
          key={i}
          style={[styles.starContainer, {
            transform: [{
              scale: new Animated.Value(i < rating ? 1.1 : 0.9)
            }]
          }]}
        >
          <Icon
            name={i < rating ? 'star' : 'star-o'}
            size={22}
            color={i < rating ? theme.colors.primary : theme.colors.disabled}
          />
        </Animated.View>
      ))}
    </View>
  );
};

const MoverCard = ({ mover, jobId, index }) => {
  const theme = useTheme();
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 100,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <AnimatedSurface
      style={[styles.cardSurface, {
        opacity,
        transform: [{ translateY }]
      }]}
      elevation={3}
    >
     
        <LinearGradient
          colors={[theme.colors.background, theme.colors.surface]}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <Text variant="headlineSmall" style={styles.companyName}>
              {mover.companyName}
            </Text>
            <StarRating rating={mover.rating} />
          </View>

          <View style={styles.chipGrid}>
            <Chip
              icon="phone"
              style={[styles.chip, styles.primaryChip]}
              textStyle={styles.chipText}
            >
              {mover.phoneNumber}
            </Chip>
            <Chip
              icon="email"
              style={[styles.chip, styles.secondaryChip]}
              textStyle={styles.chipText}
            >
              {mover.email}
            </Chip>
            <Chip
              icon="certificate"
              style={[styles.chip, styles.accentChip]}
              textStyle={styles.chipText}
            >
              License: {mover.businessLicense}
            </Chip>
           
          </View>

          <Button
            mode="contained"
            style={styles.selectButton}
            labelStyle={styles.buttonLabel}
            onPress={() => {
              updateDoc(doc(DB, "furnitureOrders", jobId), { moverId: mover.id });
              router.push({
                pathname: "ShowCars",
                params: { companyId: mover.id, jobId: jobId ,username:mover.username}
              });
            }}
          >
            Select Mover
          </Button>
        </LinearGradient>
      
    </AnimatedSurface>
  );
};

const ListMovers = () => {
  const [movers, setMovers] = useState([]);
  const [filteredMovers, setFilteredMovers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);
  const theme = useTheme();
  const { id: jobId } = useLocalSearchParams();

  // ... (Keep existing fetch and filter logic)
  const fetchMovers = async () => {
    try {
      const snapshot = await getDocs(collection(DB, "companies"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovers(data);
      setFilteredMovers(data);
    } catch (error) {
      console.error("Error fetching movers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovers();
  }, []);

  const handleSearch = query => {
    setSearchQuery(query);
    const filtered = movers.filter(mover =>
      mover.companyName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovers(filtered);
  };

  const handleFilter = filter => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const sortMovers = type => {
    const sorted = [...filteredMovers].sort((a, b) => {
      switch (type) {
        case 'fare':
          return a.fare - b.fare;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    setFilteredMovers(sorted);
    setSortModalVisible(false);
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={48} color={theme.colors.primary} />
        <Text variant="titleMedium" style={styles.loadingText}>
          Finding the best movers...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.headerSurface} elevation={4}>
       
        <Searchbar
          placeholder="Search by name..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={theme.colors.primary}
        />
      </Surface>

      {/* <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Top Rated', 'Best Price', 'Nearest', 'Available Now'].map((filter) => (
            <Chip
              key={filter}
              selected={activeFilters.includes(filter)}
              onPress={() => handleFilter(filter)}
              style={[
                styles.filterChip,
                activeFilters.includes(filter) && styles.activeFilterChip
              ]}
            >
              {filter}
            </Chip>
          ))}
        </ScrollView>
      </View> */}

      <FlatList
        data={filteredMovers}
        renderItem={({ item, index }) => (
          <MoverCard mover={item} jobId={jobId} index={index} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerSurface: {
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  searchbar: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  activeFilterChip: {
    backgroundColor: '#e3f2fd',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  cardSurface: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyName: {
    fontWeight: 'bold',
    flex: 1,
  },
  starContainer: {
    padding: 2,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    borderRadius: 20,
    minWidth: '45%',
  },
  primaryChip: {
    backgroundColor: '#e3f2fd',
  },
  secondaryChip: {
    backgroundColor: '#f3e5f5',
  },
  accentChip: {
    backgroundColor: '#e8f5e9',
  },
  chipText: {
    fontSize: 12,
  },
  selectButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  list: {
    paddingBottom: 16,
  },
});

export default ListMovers