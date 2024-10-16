// movie-app/components/ErrorMessage.tsx

import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <Text style={styles.errorText}>{message}</Text>
);

export default ErrorMessage;

const styles = StyleSheet.create({
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
