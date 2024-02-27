import { View, TextInput, Button, Text, StyleSheet, Modal, ActivityIndicator} from 'react-native';
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
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const {signUp} = useContext(AuthContext);

    const handleSignUp = async () => {
        try {
            setIsLoading(true);
            await signUp(username, email, password, repeatPassword);
            setIsLoading(false);
            navigation.navigate('Login');
        } catch (error) {
            setIsLoading(false);
            setErrorMessage(error.message);
        }
    };
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput style={styles.input}
            placeholder="Username"
            placeholderTextColor={'gray'}
            onChangeText={newLogin => setUsername(newLogin)}
            value={username}
        />
        <TextInput style={styles.input}
            placeholder="Email"
            placeholderTextColor={'gray'}
            onChangeText={newLogin => setEmail(newLogin)}
            value={email}
        />
        <View style={styles.passwordContainer}>
            <TextInput style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor={'gray'}
                onChangeText={newLogin => setPassword(newLogin)}
                value={password}
                secureTextEntry={!showPassword}
            />
            <Button
            title={showPassword ? "Hide" : "Show"}
            onPress={() => setShowPassword(!showPassword)}
            color={'gray'}
            />
        </View>
        <View style={styles.passwordContainer}>
            <TextInput style={styles.passwordInput}
                placeholder="Repeat password"
                placeholderTextColor={'gray'}
                onChangeText={newLogin => setRepeatPassword(newLogin)}
                value={repeatPassword}
                secureTextEntry={!showRepeatPassword}
            />
            <Button
                title={showRepeatPassword ? "Hide" : "Show"}
                onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                color={'gray'}
            />
            
        </View>
        <Text style={styles.passwordText}>
        At least 1 lowercase and uppercase character, 1 number and 10-20 characters.
            </Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <Button title="Submit" 
            onPress={handleSignUp} 
            color={'#226871'} 
            disabled={!username.trim() || !email.trim() || !password.trim() || !repeatPassword.trim()}
        />
        <Modal visible={isLoading} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        </Modal>
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
      marginBottom: 10,
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
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
      passwordContainer: {
        flexDirection: 'row', // Pour aligner l'input et le bouton sur la même ligne
        alignItems: 'center',
        marginBottom: 10,
        width: '70%',
        color: 'white',
      },
      passwordInput: {
        flex: 1,
        color: 'black',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
      },
      passwordText: {
        flexDirection: "row",
        fontSize: 12,
        marginBottom: 20,
        color: 'gray'
      }
  });