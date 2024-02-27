import { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import AuthContext from '../components/AuthContext';

const HomeScreen = () => {
  const {signOut} = useContext(AuthContext);

  return (
    <View>
      <Text>Page d'Accueil (Météo)</Text>
      <Button title="Sign out" onPress={() =>signOut()} color={'red'} />
    </View>
  );
};

export default HomeScreen;