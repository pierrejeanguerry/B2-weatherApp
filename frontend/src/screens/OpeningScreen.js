import { StyleSheet, View, Text, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";

export default function OpeningScreen() {

    const [username, setUsername] = useState();
    const navigation = useNavigation();

    const backgroundColor = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    async function getUsername() {
        buffer = await SecureStore.getItemAsync("username");
        setUsername(buffer);
    }

    async function changePage() {
        setTimeout(() => {
            navigation.replace('Home');
        }, 4000);
    }

    useEffect(() => {
        getUsername();
        animateBackgroundColor();
        animateTextOpacity();
        changePage();
    }, []);
    const animateBackgroundColor = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(backgroundColor, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(backgroundColor, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    };

    const animateTextOpacity = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

    const backgroundColorInterpolate = backgroundColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#226871', '#139c80']
    });

    return (
        <Animated.View style={[styles.container, { backgroundColor: backgroundColorInterpolate }]}>
            <Animated.Text style={[styles.title, {opacity}]}>Bonjour {username}</Animated.Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    title: {
        margin: 20,
        fontSize: 30,
        fontWeight: "600",
        color: "white",
        fontStyle: "italic",
    }
})
