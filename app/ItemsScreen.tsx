// app/masters/ItemsScreen.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Divider, IconButton, TextInput, useTheme } from 'react-native-paper';
import AppHeader from './Header'; // Assuming Header.tsx exists and is styled
import { getData, saveData } from './storage'; // Assuming storage functions exist

// --- THEME COLORS ---
const GARNISH_RED = '#D32F2F'; // Primary brand color
const DARK_TEXT = '#1F1F1F';
const LIGHT_BG = '#F7F7F7';
const CARD_BG = '#FFFFFF';

type Item = { id: string; name: string; rate: number; taxPercent: number };

export default function ItemsScreen() {
  const theme = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [rate, setRate] = useState('');
  const [tax, setTax] = useState('');

  // 1. Load Data
  useEffect(() => {
    (async () => {
      try {
        const stored = await getData('master_items');
        if (stored) setItems(stored);
      } catch (error) {
        console.error('Failed to load items:', error);
      }
    })();
  }, []);

  // 2. Save Data Helper
  const updateStorage = useCallback(async (newItems: Item[]) => {
    setItems(newItems);
    await saveData('master_items', newItems);
  }, []);

  // 3. Add Item
  const addItem = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Item Name is required.');
      return;
    }
    const rateValue = parseFloat(rate || '0');
    const taxValue = parseFloat(tax || '0');

    const item: Item = {
      id: 'ITM-' + new Date().getTime(),
      name: name.trim(),
      rate: isNaN(rateValue) ? 0 : rateValue,
      taxPercent: isNaN(taxValue) ? 0 : taxValue,
    };
    
    // Check for duplicate name (optional Marg ERP feature)
    if (items.some(i => i.name.toLowerCase() === item.name.toLowerCase())) {
        Alert.alert('Duplicate Item', 'An item with this name already exists.');
        return;
    }

    const next = [item, ...items];
    await updateStorage(next);
    setName(''); setRate(''); setTax('');
  };

  // 4. Delete Item
  const deleteItem = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const next = items.filter(i => i.id !== id);
            await updateStorage(next);
          }
        },
      ]
    );
  };


  // --- Render Functions ---
  const renderItem = ({ item }: { item: Item }) => (
    <Card style={styles.itemCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <IconButton
          icon={() => <MaterialCommunityIcons name="delete" size={24} color={GARNISH_RED} />}
          onPress={() => deleteItem(item.id)}
          size={20}
        />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.cardDetails}>
        <Text style={styles.detailText}>
          <Text style={{ fontWeight: 'bold' }}>Rate:</Text> ₹{item.rate.toFixed(2)}
        </Text>
        <Text style={styles.detailText}>
          <Text style={{ fontWeight: 'bold' }}>Tax:</Text> {item.taxPercent}%
        </Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.screen}>
      <AppHeader title="Products" />
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.inputSection}>
            <Text style={styles.inputTitle}>Add New Item</Text>
            
            {/* Input Fields */}
            <TextInput 
              label="Item Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              outlineColor={GARNISH_RED}
              activeOutlineColor={GARNISH_RED}
              theme={{ colors: { onSurface: "#000", primary: GARNISH_RED } }}
            />
            <TextInput 
              label="Rate (Per Unit)"
              value={rate}
              onChangeText={setRate}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              outlineColor={GARNISH_RED}
              activeOutlineColor={GARNISH_RED}
              theme={{ colors: { onSurface: "#000", primary: GARNISH_RED } }}
            />
            <TextInput 
              label="Tax (%)"
              value={tax}
              onChangeText={setTax}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              outlineColor={GARNISH_RED}
              activeOutlineColor={GARNISH_RED}
              theme={{ colors: { onSurface: "#000", primary: GARNISH_RED } }}
            />
            
            {/* Action Button */}
            <Button 
              mode="contained" 
              onPress={addItem} 
              style={[styles.addButton, { backgroundColor: GARNISH_RED }]}
              icon={() => <MaterialCommunityIcons name="plus" size={20} color={CARD_BG} />}
            >
              Save Item
            </Button>
            
            <Text style={styles.listTitle}>Created Items</Text>
            <Divider style={styles.divider} />

          </View>
        }
        ListEmptyComponent={<Text style={{ padding: 12, textAlign: 'center' }}>No items created yet. Use the form above to add one.</Text>}
      />
    </View>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: LIGHT_BG, 
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  inputSection: { 
    padding: 12, 
    backgroundColor: CARD_BG,
    marginBottom: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 2,
    shadowColor: DARK_TEXT,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: DARK_TEXT,
  },
  input: {
    marginBottom: 8,
    backgroundColor: CARD_BG, // Ensure inputs look clean on white background
    height: 50,
  },
  addButton: {
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 8,
  },
  
  // --- List Styles ---
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: DARK_TEXT,
  },
  itemCard: { 
    marginHorizontal: 12,
    marginBottom: 10, 
    padding: 12, 
    backgroundColor: CARD_BG,
    borderRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_TEXT,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    backgroundColor: '#eee',
  }
});