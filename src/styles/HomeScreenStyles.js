import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
      marginTop: 25
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