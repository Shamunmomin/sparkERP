// app/settings/SettingsScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import AppHeader from './Header';
import { removeData } from './storage';

export default function SettingsScreen(){
  const clearAll = async () => {
    // clear demo keys
    await removeData('invoices_demo');
    await removeData('master_items');
    await removeData('master_customers');
    await removeData('master_suppliers');
    await removeData('purchase_orders');
    await removeData('stock_transfers');
    await removeData('payroll_employees');
    await removeData('purchase_orders');
    alert('Cleared demo data');
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Settings" />
      <View style={{ padding: 12 }}>
        <Title>Settings</Title>
        <Paragraph>Demo app settings. This area is for company/profile configuration, backup & restore, user management.</Paragraph>
        <Button mode="contained" onPress={clearAll} style={{ marginTop: 12 }}>Clear Demo Data</Button>
      </View>
    </View>
  );
}
