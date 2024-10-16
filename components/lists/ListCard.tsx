// movie-app/components/lists/ListCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TrashIcon } from 'react-native-heroicons/solid';
import { List } from '@/types';

interface ListCardProps {
  list: List;
  onPress: () => void;
  onDelete: () => void;
}

const ListCard: React.FC<ListCardProps> = ({ list, onPress, onDelete }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View>
      <Text style={styles.listName}>{list.name}</Text>
      <Text style={styles.listDescription}>{list.description}</Text>
    </View>
    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <TrashIcon size={24} color="red" />
    </TouchableOpacity>
  </TouchableOpacity>
);

export default ListCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    marginVertical: 8,
  },
  listName: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  listDescription: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
  deleteButton: { padding: 8 },
});
