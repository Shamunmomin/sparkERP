// app/inventory/StockSummaryScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Title, Card, Paragraph, Text, TextInput, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from './Header'; // Assuming AppHeader is available
import { getData } from './storage'; // Assuming getData is available

// --- THEME COLORS ---
const GARNISH_RED = '#D32F2F'; 
const DARK_TEXT = '#1F1F1F';
const LIGHT_BG = '#F7F7F7';
const CARD_BG = '#FFFFFF';
const LOW_STOCK_THRESHOLD = 10; // Demo threshold

// Define the expected Item structure
type Item = {
    id: string;
    name: string;
    rate: number;
    taxPercent: number;
    stock: number;
    // Mocked for better summary display:
    purchaseRate: number;
    mfgDate: string;
};

const HARDCODED_ITEMS: Item[] = [
    {
        id: "ITEM001",
        name: "Premium Firecrackers Box",
        rate: 1200,
        taxPercent: 18,
        stock: 5,
        purchaseRate: 900,
        mfgDate: "2024-02-10"
    },
    {
        id: "ITEM002",
        name: "Sparkler 12-inch Pack",
        rate: 150,
        taxPercent: 5,
        stock: 35,
        purchaseRate: 100,
        mfgDate: "2024-05-20"
    },
    {
        id: "ITEM003",
        name: "Rocket Launcher Mini",
        rate: 350,
        taxPercent: 12,
        stock: 8,
        purchaseRate: 250,
        mfgDate: "2024-03-15"
    },
];


export default function StockSummaryScreen() {
    const [masterItems, setMasterItems] = useState<Item[]>([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        (async () => {
            const masterItems = await getData('master_items');
            
            // DEMO: Attach mock/default stock and purchase rate if missing
            const list: Item[] = (masterItems || []).map((m: any) => ({ 
                ...m, 
                stock: m.stock ?? Math.floor(Math.random() * 50) + 1, // Mock random stock
                purchaseRate: m.rate ? m.rate * 0.8 : 0, // Mock 80% of sales rate
                mfgDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 86400000).toISOString().split('T')[0] // Mock random date
            }));
            setMasterItems(HARDCODED_ITEMS);
        })();
    }, []);

    // Filter items based on search text
    const filteredItems = useMemo(() => {
        if (!searchText) return HARDCODED_ITEMS;
        const lowerCaseSearch = searchText.toLowerCase();
        return HARDCODED_ITEMS.filter(item => 
            item.name.toLowerCase().includes(lowerCaseSearch) ||
            item.id.toLowerCase().includes(lowerCaseSearch)
        );
    }, [HARDCODED_ITEMS, searchText]);

    // --- Render Item Row ---
    const renderItem = ({ item }: { item: Item }) => {
        const stockValue = item.stock * item.purchaseRate;
        const isLowStock = item.stock <= LOW_STOCK_THRESHOLD;

        return (
            <Card style={styles.stockCard}>
                <View style={styles.cardHeader}>
                    {/* Item Name and Alert */}
                    <View style={styles.itemNameContainer}>
                        <Text style={styles.itemNameText}>{item.name}</Text>
                        {isLowStock && (
                            <View style={styles.lowStockBadge}>
                                <MaterialCommunityIcons name="alert-circle" size={16} color={GARNISH_RED} />
                                <Text style={styles.lowStockText}>Low Stock!</Text>
                            </View>
                        )}
                    </View>
                </View>
                
                <Divider style={styles.divider} />

                {/* Stock and Value Details */}
                <View style={styles.cardDetails}>
                    <View style={styles.detailColumn}>
                        <Text style={styles.detailLabel}>In Hand (Qty)</Text>
                        <Text style={[styles.detailValue, isLowStock && { color: GARNISH_RED }]}>
                            {item.stock}
                        </Text>
                    </View>

                    <View style={styles.detailColumn}>
                        <Text style={styles.detailLabel}>Stock Value (Cost)</Text>
                        <Text style={styles.detailValue}>
                            ₹{stockValue.toFixed(0)}
                        </Text>
                    </View>
                    
                    <View style={styles.detailColumn}>
                        <Text style={styles.detailLabel}>Selling Rate</Text>
                        <Text style={styles.detailValue}>
                            ₹{item.rate.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </Card>
        );
    };

    return (
        <View style={styles.screen}>
            <AppHeader title="Stock Summary" />
            
            <View style={styles.paddingContainer}>
                <Title style={styles.listTitle}>Inventory Status</Title>

                {/* Search Input */}
                <TextInput
                    label="Search Item or ID"
                    value={searchText}
                    onChangeText={setSearchText}
                    mode="outlined"
                    style={styles.searchInput}
                    left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="magnify" size={20} color={DARK_TEXT} />} />}
                    outlineColor={GARNISH_RED}
                    activeOutlineColor={GARNISH_RED}
                     theme={{ colors: { onSurface: "#000", primary: GARNISH_RED } }}
                />
                
                <Title style={styles.listSubtitle}>Displaying {filteredItems.length} Items</Title>

                <FlatList
                    data={filteredItems}
                    keyExtractor={(i) => i.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Card style={styles.emptyCard}>
                            <Paragraph style={styles.emptyText}>
                                <MaterialCommunityIcons name="package-variant-closed" size={18} color="#999" /> No items match your search or master list is empty.
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
        color: DARK_TEXT,
    },
    searchInput: {
        marginBottom: 10,
        backgroundColor: CARD_BG,
        height: 50,
        color:"#000"
    },
    listSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#666',
    },
    listContent: {
        paddingBottom: 20,
    },
    
    // --- Stock Card Styles ---
    stockCard: { 
        marginBottom: 10, 
        borderRadius: 8,
        backgroundColor: CARD_BG,
        elevation: 2,
        padding: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemNameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DARK_TEXT,
        marginRight: 10,
    },
    lowStockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE0B2', // Light Orange Background
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    lowStockText: {
        fontSize: 12,
        color: GARNISH_RED,
        marginLeft: 4,
        fontWeight: 'bold',
    },
    divider: {
        marginVertical: 8,
        backgroundColor: '#eee',
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailColumn: {
        flex: 1,
        alignItems: 'flex-start',
    },
    detailLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DARK_TEXT,
    },
    emptyCard: {
        padding: 20,
        borderRadius: 8,
        backgroundColor: CARD_BG,
        elevation: 1,
        alignItems: 'center',
        marginTop: 10,
    },
    emptyText: {
        color: '#999',
    }
});