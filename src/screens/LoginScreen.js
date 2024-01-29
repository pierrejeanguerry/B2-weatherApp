import React from 'react';
import { View, Text, Button } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Page de Connexion</Text>
      <Button
        title="Aller à la Page d'Inscription"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

export default LoginScreen;