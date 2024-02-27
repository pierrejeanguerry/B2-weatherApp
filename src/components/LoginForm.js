import { View, TextInput, Button, Text, StyleSheet, Modal, ActivityIndicator} from 'react-native';
import { useState, useContext } from 'react';
import AuthContext  from './AuthContext'

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const {signIn} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn(login, password);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={'gray'}
            onChangeText={newLogin => setLogin(newLogin)}
            value={login}
      />
      <View style={styles.passwordContainer}>
        <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor={'gray'}
              onChangeText={newPassword => setPassword(newPassword)}
              value={password}
              secureTextEntry={!showPassword}
        />
        <Button
        style={styles.passwordButton}
        title={showPassword ? "Hide" : "Show"}
        onPress={() => setShowPassword(!showPassword)}
        color={'gray'}
        />
      </View>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="Submit" onPress={handleSignIn} color={'#227138'} disabled={!login.trim() || !password.trim()}/>
      <Modal visible={isLoading} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond gris foncé semi-transparent
  },
  passwordContainer: {
    flexDirection: 'row', // Pour aligner l'input et le bouton sur la même ligne
    alignItems: 'center',
    marginBottom: 20,
    width: '70%',
    color: 'white',
  },
  passwordInput: {
    flex: 1,
    color: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
});

export default LoginForm;