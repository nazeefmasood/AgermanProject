import React from 'react'
import CompanyProfile from '../../../components/Companies/CompanyProfile'
import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native';

const CompanyDetails = () => {
  const params = useLocalSearchParams();
  const id =params.id
  return (
    <CompanyProfile cardid={id}/>
   
  )
}

export default CompanyDetails