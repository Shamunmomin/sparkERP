// app/pos/PosScreen.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Card, Button, TextInput, Text, Title, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from './Header';

// --- THEME COLORS ---
const GARNISH_RED = '#D32F2F'; 
const DARK_TEXT = '#1F1F1F';
const LIGHT_BG = '#F7F7F7';
const CARD_BG = '#FFFFFF';
const CART_BG = '#EEE'; // Subtle different background for the cart area
const { height } = Dimensions.get('window');

type Item = { id: string; name: string; rate: number };
type CartItem = Item & { qty: number; lineId: string };

const SAMPLE_ITEMS: Item[] = [
    { id: 'itm-1', name: 'Paracetamol (500mg)', rate: 10.00 },
    { id: 'itm-2', name: 'Amoxicillin (250mg) Tablet', rate: 45.50 },
    { id: 'itm-3', name: 'Vitamin C Chewable', rate: 250.00 },
    { id: 'itm-4', name: 'N95 Mask (Single)', rate: 65.00 },
    { id: 'itm-5', name: 'Hand Sanitizer (500ml)', rate: 120.00 },
    { id: 'itm-6', name: 'Cough Syrup (100ml)', rate: 98.75 },
    { id: 'itm-7', name: 'Gauze Bandage (Large)', rate: 30.00 },
    { id: 'itm-8', name: 'Pain Relief Spray', rate: 185.00 },
];

export default function PosScreen(){
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [lastId, setLastId] = useState(0); // For unique cart line item IDs

    // --- Core Cart Logic ---

    // Filtered list for the search panel
    const filteredItems = useMemo(() => {
        if (!search) return SAMPLE_ITEMS;
        const lowerSearch = search.toLowerCase();
        return SAMPLE_ITEMS.filter(item => 
            item.name.toLowerCase().includes(lowerSearch) || item.id.includes(lowerSearch)
        );
    }, [search]);

    // Add/Update Cart Item
    const addToCart = useCallback((item: Item) => {
        setCart(prev => {
            // Check if item already exists in cart by item.id
            const existingIndex = prev.findIndex(i => i.id === item.id);

            if (existingIndex > -1) {
                // If exists, increment quantity
                const newCart = [...prev];
                newCart[existingIndex] = {
                    ...newCart[existingIndex],
                    qty: newCart[existingIndex].qty + 1
                };
                return newCart;
            } else {
                // If new, add it
                setLastId(prevId => prevId + 1);
                return [{ ...item, qty: 1, lineId: `L-${lastId + 1}` }, ...prev];
            }
        });
        setSearch(''); // Clear search after adding
    }, [lastId]);

    // Update Quantity
    const updateQty = (lineId: string, delta: number) => {
        setCart(prev => prev.map(i => {
            if (i.lineId === lineId) {
                const newQty = i.qty + delta;
                return newQty > 0 ? { ...i, qty: newQty } : i;
            }
            return i;
        }).filter(i => i.qty > 0)); // Remove if quantity drops to 0
    };

    // Calculate Totals
    const { total, subtotal, totalItems } = useMemo(() => {
        const sub = cart.reduce((s, i) => s + (i.rate * i.qty), 0);
        // Assuming 18% tax on everything for simplicity
        const tax = sub * 0.18; 
        const total = sub + tax;
        const itemsCount = cart.reduce((s, i) => s + i.qty, 0);
        return { total, subtotal: sub, totalItems: itemsCount };
    }, [cart]);

    const handleCheckout = () => {
        if (cart.length === 0) {
            Alert.alert("Cart Empty", "Please add items to the cart before checking out.");
            return;
        }
        Alert.alert(
            "Confirm Payment", 
            `Total: ₹${total.toFixed(2)}`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Pay Now", onPress: () => {
                    Alert.alert("Success", `Invoice completed. Total: ₹${total.toFixed(2)}`);
                    setCart([]);
                }}
            ]
        );
    };

    // --- Render Components ---

    const renderCatalogItem = ({ item }: { item: Item }) => (
        <Card style={styles.catalogCard}>
            <TouchableOpacity onPress={() => addToCart(item)} style={styles.catalogTouchable}>
                <View style={styles.catalogItemDetails}>
                    <Text style={styles.catalogItemName}>{item.name}</Text>
                    <Text style={styles.catalogItemRate}>₹{item.rate.toFixed(2)}</Text>
                </View>
                <IconButton
                    icon={() => <MaterialCommunityIcons name="plus-circle" size={24} color={GARNISH_RED} />}
                    onPress={() => addToCart(item)}
                    size={20}
                    style={{ margin: 0 }}
                />
            </TouchableOpacity>
        </Card>
    );

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItemRow}>
            <View style={styles.cartItemNameContainer}>
                <Text style={styles.cartItemNameText}>{item.name}</Text>
                <Text style={styles.cartItemRateText}>@{item.rate.toFixed(2)}</Text>
            </View>
            
            <View style={styles.qtyControl}>
                <IconButton 
                    icon="minus" 
                    size={16} 
                    onPress={() => updateQty(item.lineId, -1)} 
                    style={styles.qtyButton}
                />
                <Text style={styles.qtyText}>{item.qty}</Text>
                <IconButton 
                    icon="plus" 
                    size={16} 
                    onPress={() => updateQty(item.lineId, 1)} 
                    style={styles.qtyButton}
                />
            </View>
            
            <Text style={styles.cartLineTotal}>₹{(item.rate * item.qty).toFixed(2)}</Text>
        </View>
    );

    return (
        <View style={styles.screen}>
            <AppHeader title="POS (Quick Sale)" />

            {/* --- TOP PANEL: Product Search & Catalog --- */}
            <View style={styles.catalogPanel}>
                <TextInput 
                    label="Search Item or Scan Barcode" 
                    value={search} 
                    onChangeText={setSearch} 
                    mode="outlined"
                    style={styles.searchInput}
                    left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="magnify" size={20} color={DARK_TEXT} />} />}
                    outlineColor={GARNISH_RED}
                    activeOutlineColor={GARNISH_RED}
                />
                
                <Text style={styles.catalogTitle}>Product Catalog ({filteredItems.length} items)</Text>

                <FlatList
                    data={filteredItems}
                    keyExtractor={(i) => i.id}
                    renderItem={renderCatalogItem}
                    contentContainerStyle={styles.catalogListContent}
                    keyboardShouldPersistTaps="always"
                />
            </View>
            
            {/* --- BOTTOM PANEL: Cart & Checkout --- */}
            <View style={styles.cartPanel}>
                <Title style={styles.cartTitle}>Sales Cart ({totalItems} Qty)</Title>
                
                {/* Cart Item List */}
                <FlatList
                    data={cart}
                    keyExtractor={(i) => i.lineId}
                    renderItem={renderCartItem}
                    ListEmptyComponent={<Text style={styles.emptyCartText}>Tap an item above to add to cart.</Text>}
                    style={styles.cartList}
                />

                {/* Totals Summary */}
                <View style={styles.totalsContainer}>
                    <View style={styles.totalsRow}>
                        <Text style={styles.totalsLabel}>Subtotal</Text>
                        <Text style={styles.totalsValue}>₹{subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalsRow}>
                        <Text style={styles.totalsLabel}>Tax (18% Mock)</Text>
                        <Text style={styles.totalsValue}>₹{(total - subtotal).toFixed(2)}</Text>
                    </View>
                    <Divider style={styles.totalsDivider} />
                    <View style={styles.totalsRow}>
                        <Text style={styles.grandTotalLabel}>Grand Total</Text>
                        <Text style={styles.grandTotalValue}>₹{total.toFixed(2)}</Text>
                    </View>
                    
                    {/* Checkout Button */}
                    <Button 
                        mode="contained" 
                        onPress={handleCheckout} 
                        style={[styles.checkoutButton, { backgroundColor: GARNISH_RED }]}
                        icon={() => <MaterialCommunityIcons name="cash-register" size={20} color={CARD_BG} />}
                        disabled={cart.length === 0}
                    >
                        Checkout & Print Bill
                    </Button>
                </View>
            </View>
        </View>
    );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: LIGHT_BG },
    
    // --- Catalog Panel (Top) ---
    catalogPanel: {
        height: height * 0.45, // Allocate 45% of height for product selection
        paddingHorizontal: 12,
        paddingTop: 12,
        backgroundColor: CARD_BG,
        borderBottomWidth: 1,
        borderBottomColor: GARNISH_RED,
        elevation: 5,
    },
    searchInput: {
        marginBottom: 10,
        backgroundColor: CARD_BG,
        height: 50,
    },
    catalogTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: DARK_TEXT,
        marginBottom: 8,
    },
    catalogListContent: {
        paddingBottom: 10,
    },
    catalogCard: {
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: LIGHT_BG,
        elevation: 1,
    },
    catalogTouchable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    catalogItemDetails: {
        flex: 1,
    },
    catalogItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: DARK_TEXT,
    },
    catalogItemRate: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },

    // --- Cart Panel (Bottom) ---
    cartPanel: {
        flex: 1, // Takes the remaining space
        backgroundColor: CART_BG,
        padding: 12,
    },
    cartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DARK_TEXT,
        marginBottom: 8,
    },
    cartList: {
        flex: 1,
        maxHeight: height * 0.25, // Limit height of the scrollable list
        marginBottom: 10,
    },
    emptyCartText: {
        textAlign: 'center',
        paddingVertical: 20,
        color: '#999',
    },
    
    // Cart Item Rows
    cartItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cartItemNameContainer: {
        flex: 3,
        marginRight: 8,
    },
    cartItemNameText: {
        fontSize: 14,
        fontWeight: '600',
        color: DARK_TEXT,
    },
    cartItemRateText: {
        fontSize: 12,
        color: '#666',
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
    },
    qtyButton: {
        margin: 0,
        backgroundColor: CARD_BG,
    },
    qtyText: {
        paddingHorizontal: 5,
        fontWeight: 'bold',
        color: DARK_TEXT,
    },
    cartLineTotal: {
        flex: 2,
        textAlign: 'right',
        fontWeight: 'bold',
        color: GARNISH_RED,
        fontSize: 15,
    },

    // Totals/Checkout Footer
    totalsContainer: {
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    totalsLabel: {
        fontSize: 14,
        color: DARK_TEXT,
    },
    totalsValue: {
        fontSize: 14,
        fontWeight: '600',
        color: DARK_TEXT,
    },
    totalsDivider: {
        marginVertical: 6,
        backgroundColor: '#ccc',
    },
    grandTotalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DARK_TEXT,
    },
    grandTotalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: GARNISH_RED,
    },
    checkoutButton: {
        marginTop: 10,
        borderRadius: 8,
        paddingVertical: 5,
    },
});