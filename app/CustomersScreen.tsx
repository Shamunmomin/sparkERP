// app/masters/CustomersScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Title, Card, Button, Paragraph } from 'react-native-paper';
import AppHeader from './Header';
import { getData, saveData } from './storage';
import InputRow from './InputRow';

export default function CustomersScreen() {
  const [list, setList] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      const stored = await getData('master_customers');
      if (stored) setList(stored);
    })();
  }, []);

  const add = async () => {
    if (!name) return;
    const obj = { id: 'CUST-' + new Date().getTime(), name };
    const next = [obj, ...list];
    setList(next);
    await saveData('master_customers', next);
    setName('');
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Customers" />
      <View style={{ padding: 12 }}>
        <Title>Customers</Title>
        <InputRow label="Customer name" value={name} onChange={setName} />
        <Button mode="contained" onPress={add} style={{ marginBottom: 12 }}>
          Add Customer
        </Button>
        <FlatList
          data={list}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8, padding: 8 }}>
              <Paragraph>{item.name}</Paragraph>
            </Card>
          )}
          ListEmptyComponent={<Paragraph>No customers yet</Paragraph>}
        />
      </View>
    </View>
  );
}
