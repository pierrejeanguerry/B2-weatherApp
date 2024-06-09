import { useNavigation } from '@react-navigation/native';
import { React } from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';

export default function Station({ name, state, mac }) {
    const navigation = useNavigation();
    return (
        <View>
            <Pressable
                style={styles.container}
                onPress={() => navigation.navigate("Dashboard", { mac: mac , name: name})} >
                <Text style={styles.text}>
                    {name}
                </Text>
                {state == 0 ? (
                    <Text style={styles.off}>
                        OFF
                    </Text>
                ) : state == 1 ? (
                    <Text style={styles.on}>
                        ON
                    </Text>
                ) : (
                    <Text style={styles.error}>
                        ERROR
                    </Text>
                )}

            </Pressable>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        marginTop: 10,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        padding: 15,
        width: "95%"
    },
    text: {
        color: "white",
        fontWeight: "600"
    },
    off: {
        color: "gray",
        fontWeight: "300"
    },
    on: {
        color: "green",
        fontWeight: "300"
    },
    error: {
        color: "red",
        fontWeight: "300"
    },

})
