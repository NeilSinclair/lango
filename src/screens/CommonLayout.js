import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CommonLayout = ({ children }) => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      {children}
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={36} color="orange" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Practice')}>
          <Ionicons name="md-create" size={36} color="orange" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: 
      {flexDirection: 'row', 
      justifyContent: 'space-between', 
      padding: 10, 
      backgroundColor: '#f4f4f4',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 10
  }
});

export default CommonLayout;
