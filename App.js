import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
// import AudioRecord from 'react-native-audio-record';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';


const App = () => {
  const [buttons, setButtons] = useState([]);
  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState(false);

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
        Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY
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
        type: 'audio/wav',
        name: 'test.wav',
      });

      await axios.post('http://192.168.0.2:3000/upload', file, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Recording sent.');
    } catch (err) {
      console.error('Could not send recording', err);
    }
  };

  const fetchButtons = async () => {
    try {
      const response = await axios.get('http://192.168.0.2:3000/get-buttons');
      setButtons(response.data);
    } catch (error) {
      console.error("There was an error fetching data", error);
    }
  };


  const handleButtonPress = () => {
    setMessage('You pressed a button');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mainButton} onPressIn={startRecording} onPressOut={stopRecording}>
        <Text>{recording ? 'Recording...' : 'Press and Hold to Record'}</Text>
      </TouchableOpacity>

      {/* {buttons.map((button, index) => (
        <TouchableOpacity key={index} style={styles.newButton} onPress={handleButtonPress}>
          <Text style={styles.newButtonText}>{button}</Text>
        </TouchableOpacity>
      ))} */}

      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
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
});

export default App;
