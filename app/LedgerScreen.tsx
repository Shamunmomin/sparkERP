// app/accounting/LedgerScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity , Text} from 'react-native';
import {  Card,   TextInput, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from './Header'; // Assuming AppHeader is available
import { getData } from './storage'; // Assuming getData is available

// --- THEME COLORS ---
const GARNISH_RED = '#D32F2F'; 
const DARK_TEXT = '#1F1F1F';
const LIGHT_BG = '#F7F7F7';
const CARD_BG = '#FFFFFF';
const BALANCE_DEBIT_COLOR = '#4CAF50'; // Green for Favorable/Expected Debit Balances
const BALANCE_CREDIT_COLOR = GARNISH_RED; // Red for Adverse/Expected Credit Balances

// Define the expected Ledger structure
type Ledger = {
    id: string;
    name: string;
    group: string;
    balance: number; // Positive is Debit, Negative is Credit (simplified)
};

// Mock Ledger Data (simulating fetched and calculated balances)
const mockLedgers: Ledger[] = [
    { id: 'L-001', name: 'Cash Account', group: 'Cash-in-Hand', balance: 45000.00 },
    { id: 'L-002', name: 'Axis Bank A/C', group: 'Bank Accounts', balance: 18500.00 },
    { id: 'L-003', name: 'Outstanding Receivables (Debtors)', group: 'Sundry Debtors', balance: 78000.00 },
    { id: 'L-004', name: 'Outstanding Payables (Creditors)', group: 'Sundry Creditors', balance: -32000.00 }, // Negative balance represents Credit (Cr)
    { id: 'L-005', name: 'Sales Account', group: 'Sales', balance: -150000.00 },
    { id: 'L-006', name: 'Furniture & Fixtures', group: 'Fixed Assets', balance: 50000.00 },
    { id: 'L-007', name: 'Rent Paid', group: 'Expenses', balance: 12000.00 },
];


export default function LedgerScreen(){
    const [ledgers, setLedgers] = useState<Ledger[]>(mockLedgers);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        (async () => {
            // In a real app, this would merge dynamically generated balances
            // with a master list of ledgers.
            const stored = await getData('ledgers');
            if (stored) setLedgers(stored as Ledger[]); 
        })();
    }, []);

    // Filter items based on search text
    const filteredLedgers = useMemo(() => {
        if (!searchText) return ledgers;
        const lowerCaseSearch = searchText.toLowerCase();
        return ledgers.filter(ledger => 
            ledger.name.toLowerCase().includes(lowerCaseSearch) ||
            ledger.group.toLowerCase().includes(lowerCaseSearch)
        );
    }, [ledgers, searchText]);
    
    // --- Render Item Row ---
    const renderItem = ({ item }: { item: Ledger }) => {
        const isDebit = item.balance >= 0;
        const balanceDisplay = Math.abs(item.balance).toFixed(2);
        const balanceType = isDebit ? 'Dr' : 'Cr';
        // Use Red for Credit balances (often adverse for Assets/Cash, expected for Liabilities/Income)
        const balanceColor = isDebit ? BALANCE_DEBIT_COLOR : BALANCE_CREDIT_COLOR;

        return (
            <Card style={styles.ledgerCard}>
                <TouchableOpacity 
                    onPress={() => alert(`Viewing transactions for ${item.name}`)} 
                    style={styles.touchableArea}
                >
                    <View style={styles.cardHeader}>
                        {/* Ledger Name and Group */}
                        <View style={styles.nameGroupContainer}>
                            <Text style={styles.ledgerNameText}>{item.name}</Text>
                            <Text style={styles.groupText}>Group: {item.group}</Text>
                        </View>
                        
                        {/* Balance Details */}
                        <View style={styles.balanceContainer}>
                            <Text style={[styles.balanceValue, { color: balanceColor }]}>
                                ₹{balanceDisplay}
                            </Text>
                            <View style={[styles.balanceBadge, { backgroundColor: balanceColor }]}>
                                <Text style={styles.balanceTypeText}>{balanceType}</Text>
                            </View>
                        </View>
                    </View>

                    <MaterialCommunityIcons name="chevron-right" size={24} color="#aaa" style={styles.chevron} />
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={styles.screen}>
            <AppHeader title="General Ledger Summary" />
            
            <View style={styles.paddingContainer}>
                <Text style={styles.listTitle}>All Ledger Balances</Text>

                {/* Search Input */}
                <TextInput
                    label="Search Ledger Name or Group"
                    value={searchText}
                    onChangeText={setSearchText}
                    mode="outlined"
                    style={styles.searchInput}
                    left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="magnify" size={20} color={DARK_TEXT} />} />}
                    outlineColor={GARNISH_RED}
                    activeOutlineColor={GARNISH_RED}
                />

                <Text style={styles.listSubtitle}>Displaying {filteredLedgers.length} Accounts</Text>

                <FlatList
                    data={filteredLedgers}
                    keyExtractor={(i) => i.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Card style={styles.emptyCard}>
                            <Text style={styles.emptyText}>
                                <MaterialCommunityIcons name="book-open-page-variant" size={18} color="#999" /> No ledgers match your search.
                            </Text>
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
    
    // --- Ledger Card Styles ---
    ledgerCard: { 
        marginBottom: 10, 
        borderRadius: 8,
        backgroundColor: CARD_BG,
        elevation: 2,
    },
    touchableArea: {
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    nameGroupContainer: {
        flex: 3,
        marginRight: 10,
    },
    ledgerNameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DARK_TEXT,
        marginBottom: 2,
    },
    groupText: {
        fontSize: 12,
        color: '#999',
    },
    balanceContainer: {
        flex: 2,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    balanceValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 4,
    },
    balanceBadge: {
        // paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        minWidth: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceTypeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: CARD_BG, // White text on colored badge
    },
    chevron: {
        // marginLeft: 10,
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