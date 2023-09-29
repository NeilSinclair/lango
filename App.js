import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/Homescreen';
import Practice from './src/screens/Practice';

const Stack = createNativeStackNavigator();
const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Practice" component={Practice} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default function App() {
  return <MyStack />;
}
