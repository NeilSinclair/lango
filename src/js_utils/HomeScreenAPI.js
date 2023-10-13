
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Button } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

export const startRecording = async (recording, setRecording) => {
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
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording)
    } catch (err) {
      console.warn('Failed to start recording', err,JSON.stringify(err))
    };
  };

  export const stopRecording = async(recording, setRecording, setButtons) => {
    console.log("Stopping recording");
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    console.log("Right before sendRecording");
    sendRecording(uri, setButtons);
    setRecording(null);
  }

  export const sendRecording = async (uri, setButtons) => {
    try {
      console.log("Preparing to send recording");
      const file = new FormData();
      file.append('audio', {
        uri,
        type: 'audio/m4a',
        name: 'test.m4a',
      });

      const response = await axios.post('http://192.168.0.2:3000/upload', file, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("Returned data: ", response.data['matches']);
      setButtons(response.data['matches']);
      
      console.log('Recording sent.');
    } catch (err) {
      console.warn('Could not send recording', err);
    }
  };

  export const getMatches = async (searchWord, setButtons) => {
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

  export const getTranslation = async (buttonLabel, setMessage, choseWord, choseTranslation) => {
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

  export const sendString = async (chosenWord, chosenTranslation) => {
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
