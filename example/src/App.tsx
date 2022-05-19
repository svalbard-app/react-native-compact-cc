import React, { useState } from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import { CompactCcView, CardForm } from 'react-native-compact-cc';

export default function App() {
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleCardChange = (form: CardForm) => {
    console.log('form:', form);
    setIsValid(form.isValidForm);
  };

  const onPayAction = () => {
    if (isValid) {
      Alert.alert('Valid Credit Card!', '', [
        { text: 'OK', onPress: () => {} },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <CompactCcView
        showTitles={true}
        onChange={handleCardChange}
        acceptedCards={['visa', 'mastercard', 'discover', 'american-express']}
        /* inputStyle={styles.creditCardInput} */
      />
      <View style={styles.box}>
        <Button onPress={onPayAction} title="Pay Now!" disabled={!isValid} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  box: {
    marginTop: 5,
    paddingHorizontal: 15,
  },
  creditCardInput: {
    color: '#484848',
    borderColor: '#9B9B9B',
    paddingVertical: 5,
    fontSize: 18,
    borderBottomWidth: 2.5,
    alignItems: 'flex-start',
    borderWidth: 0,
    borderRadius: 0,
  },
});
