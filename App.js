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
  const [chosenWord, choseWord] = useState(null)

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
    });
   } catch (error) {
      console.error("Error getting translation ", error);
    }
  };

  const sendString = async () => {
    if (chosenWord) {
      try { await fetch('http://192.168.0.2:3000/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({new_word: chosenWord})
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={recording ? styles.recordingButton : styles.mainButton} onPressIn={startRecording} onPressOut={stopRecording}>
        <Text>{recording ? 'Recording...' : 'Press and Hold to Record'}</Text>
      </TouchableOpacity>

      <View style={styles.roundedBox}>
      {buttons.map((buttonLabel, index) => (
        <TouchableOpacity key={index} style={styles.newButton} onPress={() => handleButtonPress(buttonLabel)}>
          <Text style={styles.newButtonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      ))}
      </View>
      <Text style={styles.messageText}>{message}</Text>
      {chosenWord && (
        <TouchableOpacity style={styles.vocabButton} onPress={() => sendString()}>
          <Text>Add to vocab</Text>
        </TouchableOpacity>
      )}
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
  recordingButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
  },
  recordingButtonText: {
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
    height: 300,
    justifyContent: 'center'
  },
  vocabButton: {
    backgroundColor: 'yellow',
    padding: 15,
    borderRadius: 5,
  }
});

export default App;
