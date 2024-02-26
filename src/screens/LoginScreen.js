import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import LoginForm from '../components/LoginForm';


const LoginScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.textButton}>Sign up</Text>
      </Pressable>
      <Image source={require('../../assets/logov1.png')} style={styles.logo}/>
      <LoginForm/>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    height: '100%',
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
  },
  logo: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white'
  },
  input: {
    color: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    width: '70%',
  },
  buttonSubmit: {
    width: "40%",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: 'green',
  },
  erreur: {
    paddingBottom: 10,
    textAlign: 'left',
    color: 'red',
    fontWeight: 'bold',
  },
});

export default LoginScreen;