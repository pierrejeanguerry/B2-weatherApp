import axios from "axios";
import { useReducer, useMemo, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthContext from "./src/components/AuthContext";
import SettingScreen from "./src/screens/SettingScreen";
import AddBuildingScreen from "./src/screens/AddBuildingScreen";
import AddStationScreen from "./src/screens/AddStationScreen";
import SelectBuildingScreen from "./src/screens/SelectBuildingScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import { API_URL } from "react-native-dotenv"
import { LogBox } from 'react-native';
import OpeningScreen from "./src/screens/OpeningScreen";
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notification

const Stack = createNativeStackNavigator();

function AuthNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#139c80',
                    color: '#FFF'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: '#000'
                },
            }}

        >
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Me connecter' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "M'enregister" }} />
        </Stack.Navigator>
    );
}

function AppNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#139c80',
                    color: '#FFF'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: '#000'
                },
            }}
        >
            <Stack.Screen name="Opening" component={OpeningScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
            <Stack.Screen name="Setting" component={SettingScreen} options={{ title: 'Paramètres' }} />
            <Stack.Screen name="AddBuilding" component={AddBuildingScreen} options={{ title: 'Ajouter un Batiment' }} />
            <Stack.Screen name="AddStation" component={AddStationScreen} options={{ title: 'Ajouter une Station' }} />
            <Stack.Screen name="SelectBuilding" component={SelectBuildingScreen} options={{ title: 'Selectionner un Batiment' }} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
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
                    .post(`${API_URL}/api/login/check`, {}, { headers })
                    .then((res) => {
                        dispatch({ type: "RESTORE_TOKEN", token: userToken });
                    })
                    .catch((error) => {
                        dispatch({ type: "SIGN_OUT" });
                    });
            }
        };
        VerifyTokenAsync();
    }, [state.userToken]);

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
                console.log(`${API_URL}`);
                try {
                    const res = await axios.post(
                        `${API_URL}/api/login`,
                        data,
                        { headers }
                    );
                    console.log(typeof(res.data.id));
                    await Promise.all([
                        await SecureStore.setItemAsync("userToken", res.data.token_user),
                        await SecureStore.setItemAsync("user_id", res.data.id.toString()),
                        await SecureStore.setItemAsync("username", res.data.username),
                    ]);
                    dispatch({ type: "SIGN_IN", token: res.data.token_user });
                } catch (error) {
                    console.error(error);
                    throw new Error("Non valid Ids.");
                }
            },
            deleteAcc: async (password) => {
                let userToken;
                try {
                    userToken = await SecureStore.getItemAsync("userToken");
                    id = await SecureStore.getItemAsync("user_id");
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
                            const res = await axios.delete(
                                `${API_URL}/api/users/${id}`,
                                {
                                    data: data,
                                    headers: headers
                                }
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
                                `${API_URL}/api/login/logout`,
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
                    await axios.post(`${API_URL}/api/users`, data, {
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
