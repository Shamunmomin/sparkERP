// app/sales/SalesListScreen.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Divider, Paragraph, Text, Title } from 'react-native-paper';
import AppHeader from './Header'; // Assuming AppHeader is available
import { getData } from './storage'; // Assuming getData is available

// --- THEME COLORS ---
const GARNISH_RED = '#D32F2F'; 
const DARK_TEXT = '#1F1F1F';
const LIGHT_BG = '#F7F7F7';
const CARD_BG = '#FFFFFF';

// Define the expected invoice structure
type Invoice = {
    id: string;
    date: string;
    customer: string;
    totals: {
        total: number;
    };
    items: any[];
};

export default function SalesListScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);


   useEffect(() => {
  (async () => {
    try {
      const stored = await getData('invoices_demo');

      if (stored && stored.length > 0) {
        setInvoices(stored);
      } else {
        // fallback hardcoded data
        setInvoices([
          {
            id: "INV-1001",
            date: "2025-01-10T14:25:00",
            customer: "Rahul Sharma",
            totals: { total: 1250.5 },
            items: [
              { name: "Item A", qty: 2, price: 300 },
              { name: "Item B", qty: 1, price: 650.5 },
            ],
          },
          {
            id: "INV-1002",
            date: "2025-01-12T10:45:00",
            customer: "Anjali Enterprises",
            totals: { total: 980.0 },
            items: [
              { name: "Product X", qty: 1, price: 500 },
              { name: "Product Y", qty: 2, price: 240 },
            ],
          },
          {
            id: "INV-1003",
            date: "2025-01-14T09:10:00",
            customer: "Global Traders",
            totals: { total: 2100.75 },
            items: [
              { name: "Box A", qty: 3, price: 400 },
              { name: "Box B", qty: 1, price: 900.75 },
            ],
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to load invoices:", error);
    }
  })();
}, []);


    const handlePressInvoice = (invoice: Invoice) => {
        // In a real app, this would navigate to the Invoice Detail screen.
        alert(`Viewing details for Invoice: ${invoice.id}`);
    };

    // --- Render Item Row ---
    const renderItem = ({ item }: { item: Invoice }) => {
        const invoiceDate = new Date(item.date).toLocaleDateString();
        const invoiceTime = new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return (
            <Card style={styles.invoiceCard}>
                <TouchableOpacity 
                    onPress={() => handlePressInvoice(item)} 
                    style={styles.touchableArea}
                >
                    <View style={styles.cardHeader}>
                        {/* Left Side: Invoice ID & Customer */}
                        <View>
                            <Text style={styles.invoiceIdText}>
                                <Text style={{ color: GARNISH_RED, fontWeight: 'bold' }}>{item.id}</Text>
                            </Text>
                            <Paragraph style={styles.customerText}>
                                <MaterialCommunityIcons name="account-circle-outline" size={14} color="#666" /> {item.customer}
                            </Paragraph>
                        </View>
                        
                        {/* Right Side: Total Amount */}
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalValue}>₹{item.totals.total.toFixed(2)}</Text>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                        </View>
                    </View>

                    <Divider style={styles.divider} />
                    
                    <View style={styles.cardFooter}>
                        <View style={styles.footerDetail}>
                            <MaterialCommunityIcons name="calendar" size={14} color="#666" style={{ marginRight: 4 }} />
                            <Text style={styles.footerText}>{invoiceDate} at {invoiceTime}</Text>
                        </View>
                        <View style={styles.footerDetail}>
                            <MaterialCommunityIcons name="package-variant-closed" size={14} color="#666" style={{ marginRight: 4 }} />
                            <Text style={styles.footerText}>{item.items.length} Items</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={GARNISH_RED} />
                    </View>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={styles.screen}>
            <AppHeader title="Sales Invoices List" />
            <View style={styles.paddingContainer}>
                <Title style={styles.listTitle}>All Sales Documents</Title>
                <FlatList
                    data={invoices}
                    keyExtractor={(i) => i.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Card style={styles.emptyCard}>
                            <Paragraph style={styles.emptyText}>
                                <MaterialCommunityIcons name="file-search-outline" size={18} color="#999" /> No sales invoices found.
                            </Paragraph>
                        </Card>
                    }
                />
            </View>
        </View>
    );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
    screen: { 
        flex: 1, 
        backgroundColor: LIGHT_BG, 
    },
    paddingContainer: { 
        flex: 1,
        padding: 12 
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: DARK_TEXT,
    },
    listContent: {
        paddingBottom: 20,
    },
    
    // --- Invoice Card Styles ---
    invoiceCard: { 
        marginBottom: 10, 
        borderRadius: 8,
        backgroundColor: CARD_BG,
        elevation: 2,
    },
    touchableArea: {
        padding: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    invoiceIdText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DARK_TEXT,
        marginBottom: 4,
    },
    customerText: {
        fontSize: 14,
        color: '#666',
    },
    totalContainer: {
        alignItems: 'flex-end',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: GARNISH_RED,
    },
    totalLabel: {
        fontSize: 12,
        color: '#999',
    },
    divider: {
        marginVertical: 8,
        backgroundColor: '#eee',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerDetail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#666',
    },
    emptyCard: {
        padding: 20,
        borderRadius: 8,
        backgroundColor: CARD_BG,
        elevation: 1,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
    }
});