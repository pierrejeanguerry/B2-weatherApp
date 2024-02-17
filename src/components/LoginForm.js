import { View, TextInput, Button, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const storeToken = async (token) =>{
    try{
      await AsyncStorage.setItem('token', token);
      console.log("Data stored");
    }
    catch{
      console.error("storeToken error");
    }
  }

  function handleSubmit(){
    const data= {
      'username': login,
      'password': password
    }

    const headers = {
      'Content-Type': 'application/json',
    }
    axios.post('http://192.168.1.94:8000/api/login', data, headers)
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.error('Une erreur s\'est produite:', error);
    })
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
  non: {
    color: 'red',
    fontSize: 24,
    fontWeight: 'bold',
  },
  oui: {
    color: 'green',
    fontSize: 24,
    fontWeight: 'bold',
  }
});

export default LoginForm;