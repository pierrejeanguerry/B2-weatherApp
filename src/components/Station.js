import { useNavigation } from '@react-navigation/native';
import { React } from 'react';
import { Pressable, View, Text } from 'react-native';

export default function Station({ name, state, mac }) {
    const navigation = useNavigation();
    return (
        <View>
            <Pressable
                onPress={() => navigation.navigate("Dashboard", { mac: mac })} >
                <Text>
                    {name}
                </Text>
                <Text>
                    {state == 0 ? 'OFF' : state == 1 ? 'ON' : 'ERROR'}
                </Text>

            </Pressable>
        </View >
    )
}
