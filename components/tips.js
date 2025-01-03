import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TipsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Welcome to Pack and Go!</Text>
      <Text style={styles.subHeading}>Tips for Users:</Text>
      <View style={styles.tipContainer}>
        <Text style={styles.tip}>1. Plan ahead and schedule your move in advance.</Text>
        <Text style={styles.tip}>2. Pack your belongings securely to prevent damage during transit.</Text>
        <Text style={styles.tip}>3. Label your boxes clearly to make unpacking easier.</Text>
        <Text style={styles.tip}>4. Communicate any special instructions or requirements with your driver.</Text>
        <Text style={styles.tip}>5. Leave feedback after your move to help improve our service.</Text>
      </View>
      <Text style={styles.subHeading}>Things You Can Do:</Text>
      <View style={styles.actionContainer}>
        <Text style={styles.action}>- Schedule a move</Text>
        <Text style={styles.action}>- Track your move in real-time</Text>
        <Text style={styles.action}>- View past move history</Text>
        <Text style={styles.action}>- Contact customer support</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  tipContainer: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  tip: {
    fontSize: 16,
    marginBottom: 10,
  },
  actionContainer: {
    alignSelf: 'stretch',
  },
  action: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default TipsScreen;
