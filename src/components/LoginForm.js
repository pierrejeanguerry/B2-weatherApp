import { View, TextInput, Button, Text, StyleSheet} from 'react-native';
import { AsyncStorage } from '@react-native-async-storage/async-storage'
import { useForm, Controller } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [bool, setBool] = useState(false);

  function handleSubmit(){

      const response = axios({
        method: "post",
        url: 'http://192.168.1.94:8081/api/login',
        body: {
          'username': login,
          'password': password
        }
      })
      .then(() => {
        setBool(true);
        // AsyncStorage.setItem('token', response.data.token);
        // Navigation.navigate('Home');
      })
      .catch ((error) => {
        console.error('Erreur de connexion : ', error);
      });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Login"
            placeholderTextColor={'white'}
            onChangeText={newLogin => setLogin(newLogin)}
          />
          <TextInput
            style={styles.input}
            placeholder="password"
            placeholderTextColor={'white'}
            onChangeText={newPassword => setPassword(newPassword)}
          />
      <Button title="Submit" onPress={handleSubmit} color={'#227138'} />
      {bool ? <Text style={styles.input}>Oui</Text>: <Text style={styles.input}>Non</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: '100%'
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
  button: {
    width: "40%",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: 'green',
  },
});

export default LoginForm;