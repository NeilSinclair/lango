import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Button } from 'react-native';
import axios from 'axios';
// import AudioRecord from 'react-native-audio-record';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import CommonLayout from './CommonLayout';
import ScreenWrapper from '../components/ScreenWrapper';


const HomeScreen = () => {
  const [buttons, setButtons] = useState([]);
  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState(false);
  const [chosenWord, choseWord] = useState(null);
  const [chosenTranslation, choseTranslation] = useState(null);
  const [searchText, setSearchText] = useState('N/A');

  const startRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Recording started");
      const {recording} = await Audio.Recording.createAsync(
        // Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording)
    } catch (err) {
      console.error('Failed to start recording', err,JSON.stringify(err))
    };
  };

  const stopRecording = async() => {
    console.log("Stopping recording");
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    sendRecording(uri);
    setRecording(null);
  }

  const sendRecording = async (uri) => {
    try {
      const file = new FormData();
      file.append('audio', {
        uri,
        type: 'audio/m4a',
        name: 'test.m4a',
      });

      await axios.post('http://192.168.0.2:3000/upload', file, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(response => {
        console.log("Returned data: ", response.data['matches']);
        setButtons(response.data['matches']);
      });

      console.log('Recording sent.');
    } catch (err) {
      console.error('Could not send recording', err);
    }
  };

  const getMatches = async (searchWord) => {
    try {
      await axios.get('http://192.168.0.2:3000/matches', {
        params: { 
          word: searchWord
        }
      }).then(response => {
        console.log("Returned data: ", response.data['matches']);
        setButtons(response.data['matches']);
      });
      console.log('Search word sent.');
    } catch (err) {
      console.error('Could not get search word matches', err);
    }
  };

  const handleButtonPress = async (buttonLabel) => {
    console.log(`Button ${buttonLabel} pressed`);
    // Send the word through to the translation part of the api
    try { await axios.get('http://192.168.0.2:3000/translate', {
      params: {
        word: buttonLabel
      }
    }).then(response => {
      console.log("Returned data: ", response.data['translation'])
      setMessage(response.data['translation']);
      choseWord(buttonLabel);
      choseTranslation(response.data['translation'])
    });
   } catch (error) {
      console.error("Error getting translation ", error);
    }
  };

  const sendString = async () => {
    if (chosenWord) {
      console.log('Translation chosen is ', chosenTranslation)
      try { await fetch('http://192.168.0.2:3000/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({text_string: chosenTranslation})
      })
      .then(response => response.json())
      .then(data => {
        console.log(data['message']);
      });
    } catch (error) {
      console.error('Error adding a new word: ', error)
    }
  };
  
  }

  const handleSearch =  (text) => {
    console.log('You searched for', text);
  };

  return (
      <CommonLayout>
        <View style={styles.searchContainer}>
          <TextInput style={styles.inputBox} placeholder='Search' value={searchText} onChangeText={(text) => setSearchText(text)}/>
          <TouchableOpacity style={styles.searchButton} onPress={() => getMatches(searchText)}>
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recordingContainer}>
          <TouchableOpacity style={styles.mainButton} 
              onPressIn={startRecording} 
              onPressOut={stopRecording}>
              <Image source={require('../../assets/images/microphone.png')} style={{ width: 50, height: 50 }} />
          </TouchableOpacity>
          <Text style={{fontSize: 20}}>{recording ? 'Recording...' : 'Press and Hold to Record'}</Text>
        </View>
      <View style={styles.container}>
        <View style={styles.roundedBox}>
        {buttons.map((buttonLabel, index) => (
          <TouchableOpacity key={index} style={styles.newButton} onPress={() => handleButtonPress(buttonLabel)}>
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
          <TouchableOpacity style={styles.vocabButton} onPress={() => sendString()}>
            <Text>Add to vocab</Text>
          </TouchableOpacity>
        )}
      </View>
      </CommonLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#84cdcf',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10, 
    // height: 500
  },
  recordingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    color: 'black',
    fontsize: 30
  },
  searchContainer: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  searchButton: {
    backgroundColor: 'orange',
    borderRadius: 20,
    height:35,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  inputBox: {
    borderWidth: 1, 
    flex: 1, 
    height: 30,
    // width: '60%',
    borderColor: 'gray',
    marginRight: 10,
    borderRadius: 5,
    paddingLeft: 10,
  },
  mainButton: {
    padding: 15,
    borderRadius: 5,
    marginRight: 20,
  },
  mainButtonText: {
    color: 'black',
    fontSize: 16,
  },
  newButton: {
    backgroundColor: '#ddd',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  newButtonText: {
    color: 'black',
  },
  messageText: {
    marginTop: 20,
    color: 'white',
  },
  roundedBox: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'gray',
    padding: 10,
    margin: 5,
    width: 200,
    justifyContent: 'center'
  },
  vocabButton: {
    backgroundColor: '#34eb9e',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    fontSize: 20
  }
});

export default HomeScreen;
