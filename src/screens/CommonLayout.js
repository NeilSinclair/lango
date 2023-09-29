import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
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
          <Text onPress={showMenu} style={styles.menuText}>
            Show menu
          </Text>
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
  },
  menuText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  menuItem: {
    color: 'blue',
  },
});

export default CommonLayout;
