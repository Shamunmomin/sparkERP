// app/reports/BalanceSheetScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';
import AppHeader from './Header';

export default function BalanceSheetScreen(){
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Balance Sheet" />
      <View style={{ padding: 12 }}>
        <Title>Balance Sheet</Title>
        <Paragraph>Balance sheet template — populate with ledger data.</Paragraph>
      </View>
    </View>
  );
}
