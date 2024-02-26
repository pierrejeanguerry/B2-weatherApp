import axios from 'axios';
import { useReducer, useMemo, createContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AuthContext from './src/components/AuthContext';

const Stack = createNativeStackNavigator();
export default function App({ navigation }) {

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        console.error('message', error);
      }
      if (userToken){
      const headers = {
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'token_user' : userToken
      }
      axios.post('http://176.190.38.210:8001/api/login/check', {}, headers)
      .then((res) => {
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      })
      .catch((error) => {
          console.error('Une erreur s\'est produite:', error);
      })
    };

    bootstrapAsync();
  }
  }, []);

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  
  async function getValueFor(key) {
    return await SecureStore.getItemAsync(key);
  }

  const authContext = useMemo(
    () => ({
      signIn: async (login, password) => {
        const headers = {
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          "Accept": "application/json"
        }
        const data= {
          'username': login,
          'password': password
        }
        try {
          const res = await axios.post('http://176.190.38.210:8001/api/login', data, headers);
          await save('userToken', res.data.token_user); // Attendez que le jeton soit enregistré
          dispatch({ type: 'SIGN_IN', token: res.data.token_user });
        } catch (error) {
          console.error('Une erreur s\'est produite:', error);
        }
      },
      signOut: async () => {
        let userToken;
        try {
          userToken = getValueFor('userToken');
        } catch (error) {
          console.error('Erreur lors de la récupération du token :', error);
        }
        try {
          if (userToken) {
            const headers = {
              'Connection': 'keep-alive',
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'token_user' : userToken
            }
            await axios.post('http://176.190.38.210:8001/api/login/logout', {}, headers)
            await SecureStore.deleteItemAsync('userToken');
            dispatch({ type: 'SIGN_OUT' });
          }
        }catch (error) {
            console.error('Une erreur s\'est produite :', error);
        }
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.userToken == null ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}