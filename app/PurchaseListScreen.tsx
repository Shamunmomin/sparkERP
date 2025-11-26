// app/purchase/PurchaseListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Title, Card, Paragraph } from 'react-native-paper';
import AppHeader from './Header';
import { getData } from './storage';

export default function PurchaseListScreen(){
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const stored = await getData('purchase_orders');
      if (stored) setOrders(stored);
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Purchase List" />
      <View style={{ padding: 12 }}>
        <Title>Purchase Orders</Title>
        <FlatList
          data={orders}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8, padding: 8 }}>
              <Paragraph>{item.id} — {item.supplier}</Paragraph>
            </Card>
          )}
          ListEmptyComponent={<Paragraph>No orders</Paragraph>}
        />
      </View>
    </View>
  );
}
