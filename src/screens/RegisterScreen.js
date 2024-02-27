import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import RegisterForm from '../components/RegisterForm';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [hide, setHide] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setHide(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setHide(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Pressable style={styles.button}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
          })
        }
        >
          <Text style={styles.textButton}>Sign in</Text>
        </Pressable>
        {hide ? null : <Image source={require('../../assets/logov1.png')} style={styles.logo}/>}
        <RegisterForm/>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container:{
    height: '100%',
    backgroundColor: "white",
    padding: "auto"
  },
  textButton:{
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    color: 'black',
    width: "40%",
    marginTop: "5%",
    marginRight:"5%",
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: '#227138',
  },
  logo: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    resizeMode: 'contain',
  }
});

export default RegisterScreen;