// Practice.js
import React, { useState} from 'react';
import { View, Text, Button, Switch, TouchableOpacity } from 'react-native';
import CommonLayout from './CommonLayout';
import { StyleSheet } from 'react-native';

const Practice = () => {
  const [data, setData] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [restartButton, showRestartButton] = useState(false)

  const startPractice = async () => {
    try {
      let response = await fetch('http://192.168.0.2:3000/sentence_practice');
      let jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      cone
      console.error("There was an issue fetching the data:", error);
    }
  };

  const handleButtonPress = (word) => {
    if (word === data.correct_word) {
      console.log("correct word");
      showRestartButton(true);
    } else {
      console.log("incorrect word");
    }
  };

  return (
    <CommonLayout>
      <View style={{ flex: 1, padding: 20 }}>
        {data ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch
                value={showTranslation}
                onValueChange={() => setShowTranslation(!showTranslation)}
              />
              <Text>Show translation</Text>
            </View>
            <View>
              <Text>{data.sentence}</Text>
              <TouchableOpacity style={styles.wordButton}
                onPress={() => handleButtonPress(data.word1)}>
                <Text>{showTranslation ? data.translation1 : data.word1}</Text> 
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.wordButton} 
                onPress={() => handleButtonPress(data.word2)}>
                <Text>{showTranslation ? data.translation2 : data.word2}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.wordButton} 
                onPress={() => handleButtonPress(data.word3)}>
                <Text>{showTranslation ? data.translation3 : data.word3}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Button title="start practice" onPress={startPractice} />
        )}
        {restartButton ? (
            <TouchableOpacity 
                style={styles.wordButton} 
                onPress={startPractice}>
                <Text>Next Practice</Text>
            </TouchableOpacity>
        ) : (
          <></>
        )}
      </View> 
    </CommonLayout>
  );
};

const styles = StyleSheet.create({ 
  topContainer: {
    marginTop: 25,
    marginRight: 10,
    marginLeft: 20
  },
  practiceContainer: {

  },
  wordButton: {
    padding: 15,
    borderRadius: 5,
    marginRight: 20,
  }
})


export default Practice;