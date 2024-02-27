import { View, TextInput, Button, Text, StyleSheet} from 'react-native';
import { useState, useContext } from 'react';
import React from 'react';
import AuthContext from './AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    const {signUp} = useContext(AuthContext);

    const handleSignUp = async () => {
        try {
            await signUp(username, email, password, repeatPassword);
            navigation.goBack();
        } catch (error) {
          setErrorMessage(error.message);
        }
      };
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput style={styles.input}
            placeholder="Username"
            placeholderTextColor={'black'}
            onChangeText={newLogin => setUsername(newLogin)}
            value={username}
            />
        <TextInput style={styles.input}
            placeholder="Email"
            placeholderTextColor={'black'}
            onChangeText={newLogin => setEmail(newLogin)}
            value={email}
            />
        <TextInput style={styles.input}
            placeholder="Password"
            placeholderTextColor={'black'}
            onChangeText={newLogin => setPassword(newLogin)}
            value={password}
            // secureTextEntry={true}
            />
        <TextInput style={styles.input}
            placeholder="Repeat password"
            placeholderTextColor={'black'}
            onChangeText={newLogin => setRepeatPassword(newLogin)}
            value={repeatPassword}
            // secureTextEntry={true}
            />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <Button title="Submit" 
            onPress={handleSignUp} 
            color={'#226871'} 
            disabled={!username.trim() || !email.trim() || !password.trim() || !repeatPassword.trim()}
            />
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: 'black'
    },
    input: {
      color: 'black',
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
    error: {
      paddingBottom: 10,
      textAlign: 'left',
      color: 'red',
      fontWeight: 'bold',
    },
  });