// app/accounting/JournalVoucherScreen.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { Title, Button, Paragraph } from 'react-native-paper';
import AppHeader from './Header';
import InputRow from './InputRow';

export default function JournalVoucherScreen(){
  const [narration, setNarration] = useState('');
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Journal Voucher" />
      <View style={{ padding: 12 }}>
        <Title>Journal Voucher</Title>
        <InputRow label="Narration" value={narration} onChange={setNarration} />
        <Button mode="contained" onPress={() => { /* implement saving */ }} style={{ marginTop: 12 }}>
          Create Voucher
        </Button>
        <Paragraph style={{ marginTop: 12 }}>This screen is a template for journal vouchers (debit/credit entries)</Paragraph>
      </View>
    </View>
  );
}
