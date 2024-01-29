import React from 'react';
import { View, Text, Button } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Page d'Inscription</Text>
      <Button
        title="Aller à la Page de Connexion"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default RegisterScreen;