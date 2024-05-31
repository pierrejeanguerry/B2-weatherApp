import axios from "axios";
import { useReducer, useMemo, createContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AuthContext from "./src/components/AuthContext";
import SettingScreen from "./src/screens/SettingScreen";
import { createStackNavigator } from "@react-navigation/stack";
import AddBuildingScreen from "./src/screens/AddBuildingScreen";
import AddRoomScreen from "./src/screens/AddRoomScreen";
import AddStationScreen from "./src/screens/AddStationScreen";
import SelectBuildingScreen from "./src/screens/SelectBuildingScreen";
import SelectRoomScreen from "./src/screens/SelectRoomScreen";
import DashboardScreen from "./src/screens/DashboardScreen";

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="AddBuilding" component={AddBuildingScreen} />
      <Stack.Screen name="AddRoom" component={AddRoomScreen} />
      <Stack.Screen name="AddStation" component={AddStationScreen} />
      <Stack.Screen name="SelectBuilding" component={SelectBuildingScreen} />
      <Stack.Screen name="SelectRoom" component={SelectRoomScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}
export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
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
    const VerifyTokenAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        console.error("message", error);
        return;
      }
      if (userToken) {
        const headers = {
          Connection: "keep-alive",
          "Content-Type": "application/json",
          Accept: "application/json",
          token_user: userToken,
        };
        axios
          .post("http://176.190.38.210:8000/api/login/check", {}, { headers })
          .then((res) => {
            dispatch({ type: "RESTORE_TOKEN", token: userToken });
          })
          .catch((error) => {
            dispatch({ type: "SIGN_OUT" });
          });
      }
    };
    VerifyTokenAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (login, password) => {
        const headers = {
          Connection: "keep-alive",
          "Content-Type": "application/json",
          Accept: "application/json",
        };
        const data = {
          username: login,
          password: password,
        };
        try {
          const res = await axios.post(
            "http://176.190.38.210:8000/api/login",
            data,
            { headers }
          );
          await Promise.all([
            SecureStore.setItemAsync("userToken", res.data.token_user),
            SecureStore.setItemAsync("username", res.data.username),
            SecureStore.setItemAsync("email", res.data.email),
          ]);
          dispatch({ type: "SIGN_IN", token: res.data.token_user });
        } catch (error) {
          throw new Error("Non valid Ids.");
        }
      },
      deleteAcc: async (password) => {
        let userToken;
        try {
          userToken = await SecureStore.getItemAsync("userToken");
          try {
            if (userToken) {
              const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                token_user: userToken,
              };
              const data = {
                password: password,
              };
              const res = await axios.post(
                "http://176.190.38.210:8000/api/user/id/delete",
                data,
                { headers: headers }
              );
              await SecureStore.deleteItemAsync("userToken");
              dispatch({ type: "SIGN_OUT" });
            }
          } catch (error) {
            console.error("Une erreur s'est produite :", error);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du token :", error);
        }
      },
      signOut: async () => {
        let userToken;
        try {
          userToken = await SecureStore.getItemAsync("userToken");
          try {
            if (userToken) {
              const headers = {
                Connection: "keep-alive",
                "Content-Type": "application/json",
                Accept: "application/json",
                token_user: userToken,
              };

              const res = await axios.post(
                "http://176.190.38.210:8000/api/login/logout",
                {},
                { headers }
              );
              await SecureStore.deleteItemAsync("userToken");
              dispatch({ type: "SIGN_OUT" });
            }
          } catch (error) {
            console.error("Une erreur s'est produite :", error);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du token :", error);
        }
      },
      signUp: async (username, email, password, repeatPassword) => {
        if (password !== repeatPassword)
          throw new Error("Passwords don't match.");
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,20}$/;
        if (!passwordRegex.test(password))
          throw new Error(
            "Password is not strong enough. At least 1 lowercase and uppercase character, 1 number, between 10 and 20 characters."
          );
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) throw new Error("Email is not valid.");
        try {
          const headers = {
            Connection: "keep-alive",
            "Content-Type": "application/json",
            Accept: "application/json",
          };
          const data = {
            username: username,
            email: email,
            password: password,
          };
          await axios.post("http://176.190.38.210:8000/api/register", data, {
            headers,
          });
        } catch (error) {
          console.error("Une erreur s'est produite:", error);
          throw new Error("User already exist.");
        }
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? <AuthNavigator /> : <AppNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
