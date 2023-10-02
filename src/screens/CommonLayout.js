import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';

const CommonLayout = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        anchor={
          <TouchableOpacity onPress={showMenu} style={styles.menuButton}>
          <Text style={styles.menuText}>Show menu</Text>
          </TouchableOpacity>
        }
        onRequestClose={hideMenu}
      >
        <MenuItem textStyle={styles.menuItem} onPress={() => { hideMenu(); navigation.navigate('Home'); }}>
          Home
        </MenuItem>
        <MenuItem textStyle={styles.menuItem} onPress={() => { hideMenu(); navigation.navigate('Practice'); }}>
          Practice
        </MenuItem>
      </Menu>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    padding: 5, 
    marginRight: 20,
  },
  menuText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  menuItem: {
    color: 'blue',
  },
  menuButton: {
    // width: 160,
    backgroundColor: '#dcdedd',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  }
});

export default CommonLayout;
