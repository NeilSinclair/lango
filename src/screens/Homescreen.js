import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Button } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import CommonLayout from './CommonLayout';
import ScreenWrapper from '../components/ScreenWrapper';
import { Keyboard } from 'react-native';
import { styles } from '../styles/HomeScreenStyles';
import { startRecording, stopRecording, sendRecording, getMatches, getTranslation, sendString } from '../js_utils/HomeScreenAPI';

const HomeScreen = () => {
  const [buttons, setButtons] = useState([]); // stays in Homescreen.js
  const [message, setMessage] = useState(''); // needs to be in both HomeScreen.js and HomeScreenAPI.js
  const [recording, setRecording] = useState(false); // needs to be in both HomeScreen.js and HomeScreenAPI.js
  const [chosenWord, choseWord] = useState(null);
  const [chosenTranslation, choseTranslation] = useState(null);
  const [searchText, setSearchText] = useState(''); 

  return (
      <CommonLayout>  
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.inputBox} 
            placeholder='Search' 
            value={searchText} 
            onChangeText={(text) => setSearchText(text)}
            onSubmitEditing={() => {  // This enables typing in a query and pressing enter to submit a query
              getMatches(searchText, setButtons);
              Keyboard.dismiss();
            }}
          />
          <TouchableOpacity  // This enables pressening the "search" button to submit a query
            style={styles.searchButton} 
            onPress={() => {
              getMatches(searchText, setButtons);
              Keyboard.dismiss();
            }}>
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recordingContainer}>
          <TouchableOpacity style={styles.mainButton} 
              onPressIn={()=> startRecording(recording, setRecording)} 
              onPressOut={() => stopRecording(recording, setRecording, setButtons)}>
              <Image source={require('../../assets/images/microphone.png')} style={{ width: 50, height: 50 }} />
          </TouchableOpacity>
          <Text style={{fontSize: 20}}>{recording ? 'Recording...' : 'Press and Hold to Record'}</Text>
        </View>
      <View style={styles.container}>
        <View style={styles.roundedBox}>
        {buttons.map((buttonLabel, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.newButton} 
            onPress={() => getTranslation(buttonLabel, setMessage, choseWord, choseTranslation)}
          >
            <Text style={styles.newButtonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        ))}
        </View>
      </View>
      <View  style={styles.container}>
        <Text>{message}</Text>
      </View>
      <View>  
        {chosenWord && (
          <TouchableOpacity style={styles.vocabButton} onPress={() => sendString(chosenWord, chosenTranslation)}>
            <Text>Add to vocab</Text>
          </TouchableOpacity>
        )}
      </View>
      </CommonLayout>
  );
};

export default HomeScreen;
