import React from 'react';
import { View, Text, Button, StyleSheet, Pressable  } from 'react-native';
import LoginForm from '../components/LoginForm';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.textButton}>Register</Text>
      </Pressable>
      <LoginForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor: "#181818",
    padding: "auto"
  },
  textButton:{
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    color: 'white',
    width: "40%",
    marginTop: "5%",
    marginRight:"5%",
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: '#226871',
  }
});

export default LoginScreen;