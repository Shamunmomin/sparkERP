// app/sales/SalesInvoiceScreen.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, Divider, Paragraph, Text, TextInput, Title } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import AppHeader from './Header'; // Assuming Header.tsx exists
import ItemPicker from './ItemPicker'; // Assuming ItemPicker.tsx exists
import { getData, saveData } from './storage'; // Assuming storage functions exist

// --- THEME COLORS ---
const GARNISH_RED = '#D32F2F'; 
const DARK_TEXT = '#1F1F1F';
const LIGHT_BG = '#F7F7F7';
const CARD_BG = '#eeee';
const CARD_MARGIN = 12;


// Demo catalogue uses master_items if present, otherwise inline defaults
const DEFAULT_CATALOG = [
  { id: 'itm-1', name: 'Product A', rate: 100, taxPercent: 18 },
  { id: 'itm-2', name: 'Product B', rate: 250, taxPercent: 12 },
  { id: 'itm-3', name: 'Product C', rate: 50, taxPercent: 5 },
];

type MasterItem = {
    id: string;
    name: string;
    rate: number;
    taxPercent: number;
}

type InvoiceItem = {
  id: string;
  itemId: string;
  name: string;
  qty: number;
  rate: number;
  taxPercent: number;
  amount: number; // Qty * Rate
  taxAmount: number;
  total: number; // amount + taxAmount
};

export default function SalesInvoiceScreen() {
  const [customer, setCustomer] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [qty, setQty] = useState('1');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]); // Saved invoices list (only loaded, not displayed fully here)
  const [catalog, setCatalog] = useState<MasterItem[]>(DEFAULT_CATALOG);

  // --- Data Loading ---
  useEffect(() => {
    (async () => {
      // Load existing invoices (though we won't show the list here)
      const storedInv = await getData('invoices_demo');
      if (storedInv) setInvoices(storedInv);
      
      // Load Item Master Data
      const masterItems = await getData('master_items');
      if (masterItems) {
        setCatalog(masterItems.map((m: any) => ({
          id: m.id,
          name: m.name,
          rate: typeof m.rate === 'number' ? m.rate : 0,
          taxPercent: typeof m.taxPercent === 'number' ? m.taxPercent : 0,
        })));
      }
    })();
  }, []);

  // --- Item Management ---
  function addItem() {
    if (!selectedItemId) {
      Alert.alert('Selection Required', 'Please select an item to add to the invoice.');
      return;
    }
    const catalogItem = catalog.find(c => c.id === selectedItemId);
    if (!catalogItem) return;

    const q = Math.max(1, parseInt(qty || '1', 10));
    
    // Check if item is already present to prevent duplicates (optional logic)
    if (items.some(i => i.itemId === selectedItemId)) {
         Alert.alert('Item Exists', 'This item is already in the invoice. Please remove and re-add if quantity needs updating.');
         return;
    }

    const amount = catalogItem.rate * q;
    const taxAmount = (amount * catalogItem.taxPercent) / 100;
    const total = amount + taxAmount;
    
    const invItem: InvoiceItem = {
      id: uuidv4(),
      itemId: catalogItem.id,
      name: catalogItem.name,
      qty: q,
      rate: catalogItem.rate,
      taxPercent: catalogItem.taxPercent,
      amount,
      taxAmount,
      total,
    };
    setItems(prev => [...prev, invItem]);
    setQty('1');
    setSelectedItemId(null);
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  // --- Totals Calculation ---
  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + it.amount, 0);
    const tax = items.reduce((s, it) => s + it.taxAmount, 0);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [items]);

  // --- Save Invoice ---
  async function saveInvoice() {
    if (!customer.trim()) {
      Alert.alert('Customer Required', 'Please enter the customer name.');
      return;
    }
    if (items.length === 0) {
      Alert.alert('No Items', 'Please add at least one item to the invoice.');
      return;
    }
    
    const invoice = {
      id: 'INV-' + new Date().getTime(),
      date: new Date().toISOString(),
      customer: customer.trim(),
      items,
      totals: { subtotal, tax, total },
    };
    
    const newInvoices = [invoice, ...invoices];
    setInvoices(newInvoices);
    await saveData('invoices_demo', newInvoices);
    
    Alert.alert('Success', `Invoice ${invoice.id} saved for ${invoice.customer}. Total: ₹${total.toFixed(2)}`, [
        { text: "OK", onPress: () => {
            setCustomer('');
            setItems([]);
        }}
    ]);
  }

  // --- Render Item Row ---
  const renderItemRow = (item: InvoiceItem) => (
    <View key={item.id} style={styles.itemRow}>
        <View style={styles.itemRowDetails}>
            <Text style={styles.itemRowName}>{item.name}</Text>
            <Text style={styles.itemRowID}>({item.itemId})</Text>
        </View>
        <View style={styles.itemRowData}>
            <Text style={styles.itemRowCell}>{item.qty} Qty</Text>
            <Text style={styles.itemRowCell}>@{item.rate.toFixed(2)}</Text>
            <Text style={styles.itemRowCell}>T: {item.taxPercent}%</Text>
            <Text style={[styles.itemRowCell, styles.itemRowTotal]}>₹{item.total.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
                <MaterialCommunityIcons name="close-circle-outline" size={20} color={GARNISH_RED} />
            </TouchableOpacity>
        </View>
    </View>
  );


  // --- MAIN RENDER ---
  return (
    <View style={styles.screen}>
      <AppHeader title="Create Sales Invoice" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.paddingContainer}>
            <Title style={styles.sectionTitle}>Invoice Details</Title>

            {/* Customer Input */}
            <TextInput 
                label="Customer Name / Party" 
                value={customer} 
                onChangeText={setCustomer} 
                style={styles.input} 
                mode="outlined"
                outlineColor={GARNISH_RED}
                activeOutlineColor={GARNISH_RED}
                 theme={{ colors: { onSurface: "#000", primary: GARNISH_RED } }}
            />

            <Divider style={styles.divider} />

            {/* --- Add Item Card --- */}
            <Title style={styles.sectionTitle}>Add Item</Title>
            <Card style={styles.addItemCard}>
                <Card.Content>
                    <ItemPicker 
                        catalog={catalog} 
                        selectedId={selectedItemId} 
                        onSelect={setSelectedItemId} 
                        textColor="#000"
                    />

                    <TextInput
                        label="Quantity"
                        keyboardType="numeric"
                        value={qty}
                        onChangeText={setQty}
                        mode="outlined"
                        outlineColor={GARNISH_RED}
                        activeOutlineColor={GARNISH_RED}
                        style={[styles.input, { color: "#000" }]}
 theme={{ colors: { onSurface: "#000", primary: GARNISH_RED } }}
                    />

                    <Button 
                        mode="contained" 
                        onPress={addItem}
                        style={{ backgroundColor: GARNISH_RED, marginTop: 8 }}
                        labelStyle={{ color: "#fff" }}
                        icon={() => <MaterialCommunityIcons name="plus" size={18} color={"#fff"} />}
                    >
                        Add Item to Invoice
                    </Button>
                </Card.Content>
            </Card>

            <Title style={styles.sectionTitle}>Invoice Line Items ({items.length})</Title>
            
            {/* --- Line Items List --- */}
            {items.length === 0 ? (
                <Paragraph style={styles.emptyList}>No items added to this invoice yet.</Paragraph>
            ) : (
                <View style={styles.itemListContainer}>
                    {items.map(renderItemRow)}
                </View>
            )}
            
            {/* Saved Invoices list removed from main view to simplify data entry */}
        </View>
      </ScrollView>
      
      {/* --- Totals and Save Footer (Fixed or at bottom of scroll) --- */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Paragraph style={styles.totalLabel}>Subtotal:</Paragraph>
          <Paragraph style={styles.totalValue}>₹{subtotal.toFixed(2)}</Paragraph>
        </View>
        <View style={styles.totalRow}>
          <Paragraph style={styles.totalLabel}>Tax Amount:</Paragraph>
          <Paragraph style={styles.totalValue}>₹{tax.toFixed(2)}</Paragraph>
        </View>
        <View style={[styles.totalRow, styles.grandTotalRow]}>
          <Text variant="titleMedium" style={styles.grandTotalLabel}>Grand Total:</Text>
          <Text variant="titleMedium" style={styles.grandTotalValue}>₹{total.toFixed(2)}</Text>
        </View>
        
        <Button 
            mode="contained" 
            onPress={saveInvoice} 
            style={[styles.saveButton, { backgroundColor: GARNISH_RED }]}
              labelStyle={{ color: "#fff" }}
            icon={() => <MaterialCommunityIcons name="content-save" size={20} color={CARD_BG} />}
        >
          Save & Finalize Invoice
        </Button>
      </View>
    </View>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: LIGHT_BG },
  scrollView: { flex: 1 },
  paddingContainer: { padding: CARD_MARGIN },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_TEXT,
    marginTop: CARD_MARGIN / 2,
    marginBottom: CARD_MARGIN / 2,
  },
  input: {
    marginBottom: CARD_MARGIN / 2,
    backgroundColor: "#fff",
    margin:5,
    color:"#000"
  },
  divider: {
    marginVertical: CARD_MARGIN,
    backgroundColor: '#ccc',
  },
  
  // --- Add Item Card ---
  addItemCard: {
    marginBottom: CARD_MARGIN,
    backgroundColor: CARD_BG,
    borderRadius: 8,
    elevation: 1,
    color:"#000"
  },

  // --- Line Item List Styles (Table-like view) ---
  itemListContainer: {
    backgroundColor: CARD_BG,
    borderRadius: 8,
    elevation: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  itemRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_BG,
    
  },
  itemRowDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    color:"#000"
  },
  itemRowName: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    color:"#000"
  },
  itemRowID: {
    fontSize: 12,
    color: '#000',
    marginLeft: 6,
  },
  itemRowData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    color: "#000",

  },
  itemRowCell: {
    fontSize: 14,
    color: DARK_TEXT,
    flex: 1,
  },
  itemRowTotal: {
    fontWeight: 'bold',
    color: GARNISH_RED,
    textAlign: 'right',
  },
  removeButton: {
    paddingLeft: 10,
  },
  emptyList: {
    textAlign: 'center',
    padding: 20,
    backgroundColor: CARD_BG,
    borderRadius: 8,
    color: '#000',
  },

  // --- Footer Totals and Save ---
  footer: {
    padding: CARD_MARGIN,
    backgroundColor: CARD_BG,
    borderTopWidth: 1,
    borderTopColor: '#000',
    elevation: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: DARK_TEXT,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_TEXT,
  },
  grandTotalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  grandTotalLabel: {
    fontWeight: 'bold',
    color: DARK_TEXT,
  },
  grandTotalValue: {
    fontWeight: 'bold',
    color: GARNISH_RED,
    fontSize: 20,
  },
  saveButton: {
    marginTop: 12,
    borderRadius: 8,
  },
});