// app/masters/SuppliersScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Title, Card, Button, Paragraph } from 'react-native-paper';
import AppHeader from './Header';
import { getData, saveData } from './storage';
import InputRow from './InputRow';

export default function SuppliersScreen() {
  const [list, setList] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      const stored = await getData('master_suppliers');
      if (stored) setList(stored);
    })();
  }, []);

  const add = async () => {
    if (!name) return;
    const obj = { id: 'SUP-' + new Date().getTime(), name };
    const next = [obj, ...list];
    setList(next);
    await saveData('master_suppliers', next);
    setName('');
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Suppliers" />
      <View style={{ padding: 12 }}>
        <Title>Suppliers</Title>
        <InputRow label="Supplier name" value={name} onChange={setName} />
        <Button mode="contained" onPress={add} style={{ marginBottom: 12 }}>
          Add Supplier
        </Button>
        <FlatList
          data={list}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8, padding: 8 }}>
              <Paragraph>{item.name}</Paragraph>
            </Card>
          )}
          ListEmptyComponent={<Paragraph>No suppliers yet</Paragraph>}
        />
      </View>
    </View>
  );
}
