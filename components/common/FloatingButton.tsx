// movie-app/components/common/FloatingButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FloatingButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  label?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ icon, onPress, label }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    {icon}
    {label && <Text style={styles.label}>{label}</Text>}
  </TouchableOpacity>
);

export default FloatingButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#1D4ED8',
    padding: 16,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
