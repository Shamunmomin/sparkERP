// app/sales/SalesDashboard.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Title, Button, Card, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from './Header'; // Assuming Header.tsx exists

// --- THEME & CONFIGURATION ---
const GARNISH_RED = '#D32F2F';
const DARK_TEXT = '#1F1F1F';
const LIGHT_BG = '#F7F7F7';
const CARD_BG = '#FFFFFF';
const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const ACTION_GRID_SIZE = (width - CARD_MARGIN * 3) / 2; // Two columns

// Mock Data for Sales KPIs
const salesKpiData = [
  { title: "Today's Sales", value: "₹45,500", trend: "+8%", icon: "arrow-up-right", color: '#4CAF50' }, // Green
  { title: "Collection Due", value: "₹2,10,000", trend: "15 Docs", icon: "cash-alert", color: GARNISH_RED }, // Red
  { title: "New Customers", value: "8", trend: "Since Last Week", icon: "account-plus", color: '#2196F3' }, // Blue
  { title: "Top Item Sold", value: "Paracetamol (500mg)", trend: "Quantity: 300", icon: "star", color: '#FF9800' }, // Orange
];

// Define Action Cards for the bottom grid
const actionCards = [
    { title: 'Create Invoice', route: '/SalesInvoiceScreen', icon: 'file-plus', color: '#4CAF50' },
    { title: 'Invoices List', route: '/SalesListScreen', icon: 'format-list-bulleted', color: '#2196F3' },
    { title: 'Sales Return', route: '/SalesReturnScreen', icon: 'arrow-left-bottom', color: GARNISH_RED },
    { title: 'Collection Entry', route: '/CollectionScreen', icon: 'cash-marker', color: '#FF9800' },
];

// --- KPI Row Component (Refactored to be local for simplicity) ---
const KpiRow = () => {
    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.kpiContainer}
        >
            {salesKpiData.map((kpi) => (
                <Card key={kpi.title} style={styles.kpiCard}>
                    <Card.Content style={styles.kpiContent}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <MaterialCommunityIcons 
                                name={kpi.icon as any} 
                                size={18} 
                                color={kpi.color as any} 
                                style={{ marginRight: 6 }}
                            />
                            <Text style={styles.kpiTitle}>{kpi.title}</Text>
                        </View>
                        <Text variant="headlineSmall" style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
                        <Text style={[styles.kpiTrend, { color: kpi.color }]}>{kpi.trend}</Text>
                    </Card.Content>
                </Card>
            ))}
        </ScrollView>
    );
};


// --- MAIN DASHBOARD COMPONENT ---
export default function SalesDashboard(){
    const router = useRouter();
    const theme = useTheme(); 

    return (
        <View style={styles.screen}>
            <AppHeader title="Sales" />
            
            <ScrollView style={{ flex: 1 }}>

                {/* 1. Dashboard Title Section */}
                <View style={styles.titleSection}>
                    <Title style={styles.mainTitle}>Sales Overview</Title>
                    <Text style={styles.subTitle}>Quick access and live data.</Text>
                </View>

                {/* 2. Key Performance Indicators (KPIs) */}
                <KpiRow />
                
                {/* 3. Action Grid Title */}
                <Title style={styles.actionGridTitle}>Sales Actions</Title>
                
                {/* 4. Action Grid */}
                <View style={styles.actionGrid}>
                    {actionCards.map((c) => (
                        <Card 
                            key={c.title} 
                            style={[styles.actionCard, { backgroundColor: CARD_BG }]}
                            onPress={() => router.push(c.route as any)} 
                        >
                            <View style={styles.actionCardContent}>
                                <MaterialCommunityIcons 
                                    name={c.icon as any} 
                                    size={36} 
                                    color={c.color} 
                                    style={{ marginBottom: 8 }}
                                />
                                <Text style={styles.actionCardText}>{c.title}</Text>
                            </View>
                        </Card>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
    screen: { 
        flex: 1, 
        backgroundColor: LIGHT_BG, 
    },
    titleSection: {
        paddingHorizontal: CARD_MARGIN,
        paddingTop: 10,
        paddingBottom: 5,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: DARK_TEXT,
    },
    subTitle: {
        fontSize: 14,
        color: '#666',
    },

    // --- KPI Styles ---
    kpiContainer: {
        paddingVertical: 10,
        paddingHorizontal: CARD_MARGIN - 8, // Adjust for card margin
    },
    kpiCard: {
        width: 170, 
        marginHorizontal: 8,
        borderRadius: 12,
        backgroundColor: CARD_BG, 
        elevation: 2,
    },
    kpiContent: {
        padding: 12,
    },
    kpiTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: DARK_TEXT,
    },
    kpiValue: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    kpiTrend: {
        fontSize: 12,
        fontWeight: '500',
    },

    // --- Action Grid Styles ---
    actionGridTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: CARD_MARGIN,
        marginTop: CARD_MARGIN,
        marginBottom: CARD_MARGIN / 2,
        color: DARK_TEXT,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: CARD_MARGIN,
    },
    actionCard: {
        width: ACTION_GRID_SIZE,
        height: ACTION_GRID_SIZE, 
        marginBottom: CARD_MARGIN,
        borderRadius: 12,
        backgroundColor: CARD_BG,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionCardContent: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    actionCardText: {
        fontWeight: '600',
        textAlign: 'center',
        color: DARK_TEXT,
        marginTop: 5,
    }
});