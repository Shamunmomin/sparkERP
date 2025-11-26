// app/gst/GstReturnScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import AppHeader from './Header';

export default function GstReturnScreen(){
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="GST Returns" />
      <View style={{ padding: 12 }}>
        <Title>GSTR Simulation</Title>
        <Paragraph>Simulate GSTR-1 / 3B summary from invoices. This is a placeholder for GST reports.</Paragraph>
        <Button mode="contained" onPress={() => { /* simulate generation */ }} style={{ marginTop: 12 }}>Simulate</Button>
      </View>
    </View>
  );
}
