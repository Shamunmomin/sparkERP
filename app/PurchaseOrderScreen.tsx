// app/purchase/PurchaseOrderScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Title, Card, Paragraph, Button, Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from './Header'; // Assuming AppHeader is available
import { getData } from './storage'; // Assuming getData is available

// --- THEME COLORS ---
const GARNISH_RED = '#D32F2F'; 
const DARK_TEXT = '#1F1F1F';
const LIGHT_BG = '#F7F7F7';
const CARD_BG = '#FFFFFF';

// Define the expected PO structure (expanded for better display)
type PurchaseOrder = {
    id: string;
    supplier: string;
    date: string;
    status:string;
    totalValue: number; // Mocked for display
};

// Mock PO data structure (since original only had id, supplier, date)
const mockData = [
    { id: 'PO-1001', supplier: 'PharmaDistributors Inc.', date: new Date(Date.now() - 86400000).toISOString(), status: 'Sent', totalValue: 55200.50 },
    { id: 'PO-1002', supplier: 'Chemical Suppliers Co.', date: new Date(Date.now() - 172800000).toISOString(), status: 'Pending', totalValue: 12500.00 },
    { id: 'PO-1003', supplier: 'Medical Equipments Ltd.', date: new Date().toISOString(), status: 'Received', totalValue: 8500.75 },
];


export default function PurchaseOrderScreen(){
    // In a real app, this would load purchase_orders, possibly simplified here
    const [orders, setOrders] = useState<PurchaseOrder[]>(mockData); 
    
    // In a real app, we'd use a separate state/route for PO creation. 
    // This screen will focus on the list view and navigation.

    useEffect(() => {
        (async () => {
            const stored = await getData('purchase_orders');
            if (stored) setOrders(stored as PurchaseOrder[]);
            // If the stored data is simple (like the original code), you might map it here
            // setOrders(stored.map(item => ({...item, status: 'Pending', totalValue: 0})));
        })();
    }, []);

    const handlePressOrder = (order: PurchaseOrder) => {
        // In a real app, this would navigate to the Purchase Order Detail/Edit screen.
        alert(`Viewing PO details for: ${order.id}`);
    };

    const handleCreateNew = () => {
        // In a real app, you would navigate to a new route: router.push('/purchase/CreatePurchaseOrder');
        alert('Navigating to Create New Purchase Order Form...');
    };
    
    // Helper to get status color
    const getStatusColor = (status: PurchaseOrder['status']) => {
        switch (status) {
            case 'Pending': return '#FF9800'; // Orange
            case 'Sent': return '#2196F3';    // Blue
            case 'Received': return '#4CAF50'; // Green
            default: return '#666';
        }
    };

    // --- Render PO Row ---
    const renderItem = ({ item }: { item: PurchaseOrder }) => {
        const orderDate = new Date(item.date).toLocaleDateString();
        const statusColor = getStatusColor(item.status);

        return (
            <Card style={styles.orderCard}>
                <TouchableOpacity 
                    onPress={() => handlePressOrder(item)} 
                    style={styles.touchableArea}
                >
                    <View style={styles.cardHeader}>
                        {/* Left Side: PO ID & Supplier */}
                        <View>
                            <Text style={styles.orderIdText}>
                                <Text style={{ color: GARNISH_RED, fontWeight: 'bold' }}>{item.id}</Text>
                            </Text>
                            <Paragraph style={styles.supplierText}>
                                <MaterialCommunityIcons name="truck-fast-outline" size={14} color="#666" /> {item.supplier}
                            </Paragraph>
                        </View>
                        
                        {/* Right Side: Total Amount */}
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalValue}>₹{item.totalValue.toFixed(2)}</Text>
                            <Text style={styles.totalLabel}>PO Value</Text>
                        </View>
                    </View>

                    <Divider style={styles.divider} />
                    
                    <View style={styles.cardFooter}>
                        <View style={styles.footerDetail}>
                            <MaterialCommunityIcons name="calendar" size={14} color="#666" style={{ marginRight: 4 }} />
                            <Text style={styles.footerText}>Order Date: {orderDate}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <MaterialCommunityIcons name="checkbox-blank-circle" size={10} color={statusColor} style={{ marginRight: 4 }} />
                            <Text style={[styles.statusText, { color: statusColor, fontWeight: 'bold' }]}>{item.status}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={GARNISH_RED} />
                    </View>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={styles.screen}>
            <AppHeader title="Purchase Orders" />
            
            {/* Action Header Button (Create PO) */}
            <View style={styles.actionHeader}>
                <Button 
                    mode="contained" 
                    onPress={handleCreateNew} 
                    style={{ backgroundColor: GARNISH_RED }}
                    icon={() => <MaterialCommunityIcons name="plus-circle-outline" size={20} color={CARD_BG} />}
                >
                    Create New PO
                </Button>
            </View>

            <View style={styles.paddingContainer}>
                <Title style={styles.listTitle}>Outstanding & Recent POs</Title>
                <FlatList
                    data={orders}
                    keyExtractor={(i) => i.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Card style={styles.emptyCard}>
                            <Paragraph style={styles.emptyText}>
                                <MaterialCommunityIcons name="file-search-outline" size={18} color="#999" /> No purchase orders found.
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
    actionHeader: {
        padding: 12,
        backgroundColor: CARD_BG,
        elevation: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
    
    // --- Purchase Order Card Styles ---
    orderCard: { 
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
    orderIdText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DARK_TEXT,
        marginBottom: 4,
    },
    supplierText: {
        fontSize: 14,
        color: '#666',
    },
    totalContainer: {
        alignItems: 'flex-end',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: DARK_TEXT, // Use dark text for value, not just red
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
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: LIGHT_BG,
    },
    statusText: {
        fontSize: 12,
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