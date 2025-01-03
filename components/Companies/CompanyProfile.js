
// import React ,{useEffect,useState}from 'react';
// import { ScrollView, View, Image, StyleSheet,FlatList } from 'react-native';
// import { Text, TextInput,Button,Card,Avatar } from 'react-native-paper';
// import { getDoc,doc, setDoc, collection, addDoc, getDocs, where,query,updateDoc } from 'firebase/firestore';
// import Spinner from 'react-native-loading-spinner-overlay';
// import DB from '../../database/firebaseConfig';
// import { useUser } from '@clerk/clerk-expo';
// import StarRating from './RatingMovers';

// const CompanyProfile = ({cardid}) => {
//     const badWords = ['shit',"bad1"];

//     const clean = (text) => {
//       const regex = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');
//       return text.replace(regex, '****');
      
//     };
    
//     const addWords = (...words) => {
//       badWords.push(...words);
//     };

   
//     const {user}=useUser()
   
   
//    const [loading,setLoading]=useState()
//    const [Details,setDetails]=useState([])
//    const [feedback, setFeedback] = useState('');
//    const [feedbackList, setFeedbackList] = useState([]);

//     const getDetails=async () =>{
        
//         const docRef = doc(DB, "companies", cardid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//             console.log("Document data:", docSnap.data());
//             setDetails(docSnap.data());
            
//         } else {
//             // docSnap.data() will be undefined in this case
//             console.log("No such document!");
//           }
//     }

//     const getFeedback=async () =>{
//         try {
//             console.log("CardID: "+cardid)
//             const feedbackQuery = query(collection(DB,'feedback'), where('companyId', '==', cardid));
//       const querySnapshot = await getDocs(feedbackQuery);
//         const feedbackData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log(feedbackData)
//         setFeedbackList(feedbackData);
//         setLoading(false)
       
//         } catch (error) {
//             console.log("An error occurred",error)
//         }
    
//             // docSnap.data() will be undefined in this case
              
//     }
   

//     useEffect(() => {
//         setLoading(true)   
//         getDetails()
//         getFeedback()
//     },[cardid])


//   const handleAddFeedback = async() => {
//     setFeedback(clean(feedback));
   
//     console.log(feedback)
//     try {
//        let newFeedback= await clean(feedback);
//        setFeedback(newFeedback);
//         const docRef = await addDoc(collection(DB, "feedback"), {
//             userId:user?.id,
//             companyName:Details.name,
//             companyId:cardid,
//             name:user?.fullName,
//             email:user?.emailAddresses[0].emailAddress,
//             feedback:feedback,
//           });
//         // await setDoc(doc(DB,"feedback",id),{
//         //     userId:user?.id,
//         //     name:user?.fullName,
//         //     email:user?.emailAddresses[0].emailAddress,
//         //     feedback:feedback,
//         // })
//         console.log("feedback added")
//         setFeedback(null)
//         getFeedback()
//     } catch (error) {
//         console.log(error)
//     }
//   };

// console.log(Details.username);


//     return (
      
        
//         <View style={styles.container}>
//         <Spinner visible={loading}></Spinner>
//       <View style={styles.header}>
//         <Image source={{uri:Details.logo}} style={styles.logo} />
//         <Text style={styles.title}>{Details.companyName}</Text>
//       </View>
//       <Text style={styles.description}>{Details.email}</Text>
//       <Text style={styles.description}>{Details.description}</Text>
//       <View style={{justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
           
//       <Text style={styles.feedbackTitle}>Feedback:</Text>
//       <StarRating   moverId={Details.id}/>
      
//     </View>
//       <FlatList
//         data={feedbackList}
//         horizontal={false}
//         showsVerticalScrollIndicator={false}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <Card style={styles.feedbackCard}>
//             <Card.Content style={styles.cardContent}>
//               <Avatar.Image size={40} source={item} />
//               <View style={styles.feedbackTextContainer}>
//                 <Text style={styles.username}>{item.name}</Text>
//                 <Text>{clean(item.feedback)}</Text>
//               </View>
//             </Card.Content>
//           </Card>
//         )}
//         style={styles.feedbackList}
//         contentContainerStyle={styles.feedbackListContainer}
//       />
//        <TextInput 
//         label="Feedback" 
//         placeholder="Write your feedback here..."
//         value={feedback}
//         onChangeText={setFeedback}
//         multiline
    
//         numberOfLines={4}
//         style={styles.input}
//       />
//     <Button mode="contained" onPress={()=>handleAddFeedback()} style={styles.button}>
//         Submit Feedback
//       </Button>
//     </View>

    
//   );
// };
// export default CompanyProfile;

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 16,
//     },
//     header: {
//       alignItems: 'center',
//       marginBottom: 16,
//     },
//     logo: {
//       width: 100,
//       height: 100,
//       marginBottom: 8,
//     },
//     title: {
//       fontSize: 24,
//       fontWeight: 'bold',
//     },
//     description: {
//       fontSize: 16,
//       marginBottom: 16,
//     },
//     input: {
//       marginTop: 16,
//       marginBottom: 8,
//     },
//     button: {
//       marginBottom: 16,
//     },
//     feedbackTitle: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginBottom: 8,
//     },
//     feedbackList: {
//       marginBottom: 16,
//     },
//     feedbackListContainer: {
//       paddingLeft: 16,
//     },
//     feedbackCard: {
//       marginRight: 16,
//       marginTop:10,
//       padding: 10,
//       height:90,
//       minWidth: 270,
//       justifyContent: 'center',
//     },
//     cardContent: {
//       flexDirection: 'row',
//     },
//     feedbackTextContainer: {
//       marginLeft: 10,
//     },
//     username: {
//       fontWeight: 'bold',
//     },
//   });


import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Linking } from 'react-native';
import { Text, Card, Button, Avatar, Divider, Surface, Badge, TextInput } from 'react-native-paper';
import { getDoc, doc, collection, addDoc, getDocs, where, query } from 'firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DB from '../../database/firebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import StarRating from './RatingMovers';

const CompanyProfile = ({ cardid }) => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const { user } = useUser();

  // Filter bad words
  const badWords = ['shit', 'bad1'];
  const clean = (text) => {
    const regex = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');
    return text.replace(regex, '****');
  };

  useEffect(() => {
    fetchCompanyData();
  }, [cardid]);

  const fetchCompanyData = async () => {
    try {
      const docRef = doc(DB, "companies", cardid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCompany(docSnap.data());
      }
      await fetchFeedback();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const feedbackQuery = query(collection(DB, 'feedback'), where('companyId', '==', cardid));
      const feedbackSnap = await getDocs(feedbackQuery);
      const feedbackData = feedbackSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: doc.data().timestamp || new Date().toISOString()
      }));
      setFeedbackList(feedbackData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const handleAddFeedback = async () => {
    if (!newFeedback.trim()) return;

    try {
      const cleanedFeedback = clean(newFeedback);
      await addDoc(collection(DB, "feedback"), {
        userId: user?.id,
        companyName: company.companyName,
        companyId: cardid,
        name: user?.fullName,
        email: user?.emailAddresses[0].emailAddress,
        feedback: cleanedFeedback,
        timestamp: new Date().toISOString(),
      });

      setNewFeedback('');
      await fetchFeedback();
    } catch (error) {
      console.error("Error adding feedback:", error);
    }
  };

  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <MaterialCommunityIcons name={icon} size={24} color="#555" />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const FeedbackItem = ({ item }) => (
    <Surface style={styles.feedbackItem} elevation={1}>
      <View style={styles.feedbackHeader}>
        <Avatar.Text 
          size={40} 
          label={item.name?.substring(0, 2).toUpperCase() || "UK"} 
          style={styles.feedbackAvatar}
        />
        <View style={styles.feedbackUserInfo}>
          <Text style={styles.feedbackName}>{item.name}</Text>
          <Text style={styles.feedbackDate}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Text style={styles.feedbackText}>{item.feedback}</Text>
    </Surface>
  );

  if (loading) return <Spinner visible={true} />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Previous header card code remains the same */}
      <Surface style={styles.headerCard} elevation={2}>
        <View style={styles.headerContent}>
          <Avatar.Text 
            size={80} 
            label={company.companyName?.substring(0, 2).toUpperCase()} 
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.companyName}>{company.companyName}</Text>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
              <Text style={styles.rating}>{company.rating}/5</Text>
            </View>
            {company.isLicensed && (
              <Badge style={styles.licenseBadge}>Licensed Business</Badge>
            )}
          </View>
        </View>
      </Surface>

      {/* Previous stats container code remains the same */}
      <View style={styles.statsContainer}>
        <Surface style={styles.statItem} elevation={1}>
          <Text style={styles.statNumber}>{company.yearsInOperation}</Text>
          <Text style={styles.statLabel}>Years Active</Text>
        </Surface>
        <Surface style={styles.statItem} elevation={1}>
          <Text style={styles.statNumber}>{company.businessLicense}</Text>
          <Text style={styles.statLabel}>License No.</Text>
        </Surface>
        <Surface style={styles.statItem} elevation={1}>
          <Text style={styles.statNumber}>{feedbackList.length}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </Surface>
      </View>

      {/* Previous contact information card remains the same */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <InfoItem 
            icon="email" 
            label="Email" 
            value={company.email}
          />
          <InfoItem 
            icon="phone" 
            label="Phone" 
            value={company.phoneNumber}
          />
          
            <InfoItem 
              icon="web" 
              label="Website" 
              value={company.website}
            />
          
        </Card.Content>
      </Card>

     
      {/* Feedback Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          
          
          <View style={styles.feedbackList}>
            {feedbackList.map((item) => (
              <FeedbackItem key={item.id} item={item} />
            ))}
          </View>
          {/* Add Feedback */}
          <View style={styles.addFeedbackContainer}>
            <TextInput
              mode="outlined"
              label="Write your feedback"
              value={newFeedback}
              onChangeText={setNewFeedback}
              multiline
              numberOfLines={4}
              style={styles.feedbackInput}
            />
            <Button 
              mode="contained" 
              onPress={handleAddFeedback}
              style={styles.submitButton}
              disabled={!newFeedback.trim()}
            >
              <Text style={{color:'white'}}>Submit feedback</Text>
            </Button>
          </View>

          {/* Feedback List */}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... Previous styles remain the same ...
  addFeedbackContainer: {
    marginTop: 16,
  },
  feedbackInput: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  submitButton: {
    marginBottom: 20,
    backgroundColor: '#2196F3',
    color: 'white',
  },
  feedbackList: {
    marginTop: 16,
  },
  feedbackItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackAvatar: {
    backgroundColor: '#2196F3',
  },
  feedbackUserInfo: {
    marginLeft: 12,
  },
  feedbackName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  feedbackDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  feedbackText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  // ... Rest of the previous styles remain the same ...
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    backgroundColor: 'white',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#2196F3',
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    color: '#666',
  },
  licenseBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  card: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  documentButton: {
    marginBottom: 12,
    borderColor: '#2196F3',
  }
});

export default CompanyProfile;