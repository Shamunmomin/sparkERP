// app/inventory/StockTransferScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Title, Card, Paragraph, Button } from 'react-native-paper';
import AppHeader from './Header';
import { getData, saveData } from './storage';
import InputRow from './InputRow';

export default function StockTransferScreen(){
  const [transfers, setTransfers] = useState<any[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  useEffect(() => {
    (async () => {
      const stored = await getData('stock_transfers');
      if (stored) setTransfers(stored);
    })();
  }, []);

  const add = async () => {
    if (!from || !to) return;
    const t = { id: 'ST-' + new Date().getTime(), from, to, date: new Date().toISOString() };
    const next = [t, ...transfers];
    setTransfers(next);
    await saveData('stock_transfers', next);
    setFrom(''); setTo('');
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Stock Transfer" />
      <View style={{ padding: 12 }}>
        <Title>Stock Transfer</Title>
        <InputRow label="From Location" value={from} onChange={setFrom} />
        <InputRow label="To Location" value={to} onChange={setTo} />
        <Button mode="contained" onPress={add} style={{ marginBottom: 12 }}>Transfer</Button>

        <FlatList
          data={transfers}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8, padding: 8 }}>
              <Paragraph>{item.id} — {item.from} → {item.to}</Paragraph>
            </Card>
          )}
          ListEmptyComponent={<Paragraph>No transfers</Paragraph>}
        />
      </View>
    </View>
  );
}
