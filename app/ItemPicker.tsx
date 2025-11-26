// app/common/components/ItemPicker.tsx
import React from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';

export default function ItemPicker({
  catalog,
  selectedId,
  onSelect,
}: {
  catalog: { id: string; name: string; rate?: number; taxPercent?: number }[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  textColor?: string; 
}) {
  return (
    <FlatList
      horizontal
      data={catalog}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item.id)}>
          <Card
            style={{
              padding: 8,
              marginRight: 8,
              minWidth: 140,
              backgroundColor: selectedId === item.id ? '#e6f7ff' : 'white',
            }}
          >
            <Text>{item.name}</Text>
            {typeof item.rate === 'number' && <Text>Rate: {item.rate}</Text>}
            {typeof item.taxPercent === 'number' && <Text>Tax: {item.taxPercent}%</Text>}
          </Card>
        </TouchableOpacity>
      )}
    />
  );
}
