import { View, TextInput, Button, Text, StyleSheet} from 'react-native';
import { useState, useContext } from 'react';
import AuthContext  from './AuthContext'

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const {signIn} = useContext(AuthContext);

  const handleSignIn = async () => {
    try {
      await signIn(login, password);
    } catch (error) {
      setErrorMessage(error.message); // Définir le message d'erreur pour l'afficher à l'utilisateur
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
            style={styles.input}
            placeholder="Login"
            placeholderTextColor={'white'}
            onChangeText={newLogin => setLogin(newLogin)}
            value={login}
      />
      <TextInput
            style={styles.input}
            placeholder="password"
            placeholderTextColor={'white'}
            onChangeText={newPassword => setPassword(newPassword)}
            value={password}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="Submit" onPress={handleSignIn} color={'#227138'} disabled={!login.trim() || !password.trim()}/>
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
});

export default LoginForm;