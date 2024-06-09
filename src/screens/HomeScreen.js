import { StyleSheet, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ShowStation from "../components/ShowStation";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus, faGear } from "@fortawesome/free-solid-svg-icons";

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.add}
                onPress={() => navigation.navigate("SelectBuilding")}
            >
        <FontAwesomeIcon icon={faPlus} style={styles.text}/>
            </Pressable>
            <Pressable
                style={styles.settings}
                onPress={() => navigation.navigate("Setting")}
                color={"blue"}
            >
        <FontAwesomeIcon icon={faGear} style={styles.text}/>
        </Pressable>
            <ShowStation />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        color: "white",
        height: '100%'
    },
    add: {
        alignItems: 'center',
        verticalAlign: 'center',
        backgroundColor: 'blue',
        borderRadius: 100,
        marginBottom: 20,
        width: "10%",
        height: "5%",
        padding: 10,
        margin: 5,
        position: "relative"
    },
    settings: {
        alignItems: 'center',
        verticalAlign: 'center',
        backgroundColor: 'green',
        borderRadius: 100,
        marginBottom: 20,
        width: "10%",
        height: "5%",
        padding: 10,
        margin: 5,
        position: "absolute",
        right: 5
    },
    text:{
        color:'white'
    }
});
