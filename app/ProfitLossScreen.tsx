// app/reports/ProfitLossScreen.tsx
import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Title, Card, Paragraph, Button, Text, Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from './Header'; // Assuming AppHeader is available

// --- THEME COLORS ---
const GARNISH_RED = '#D32F2F'; 
const DARK_TEXT = '#1F1F1F';
const LIGHT_BG = '#F7F7F7';
const CARD_BG = '#FFFFFF';

// --- Mock Financial Data (Actual data would come from ledgers) ---
const mockFinancialData = {
    // INCOME / REVENUE SECTION
    salesRevenue: 1500000.00,
    otherIncome: 12000.00,

    // COST OF GOODS SOLD (COGS)
    openingStock: 250000.00,
    netPurchases: 800000.00,
    closingStock: 300000.00,
    // COGS = Opening Stock + Purchases - Closing Stock = 750,000.00

    // EXPENSES SECTION (Operating Expenses)
    salaries: 300000.00,
    rent: 60000.00,
    utilities: 15000.00,
    interestPaid: 5000.00,
};

// --- Report Structure Definition (for display) ---
const reportStructure = [
    { title: "Income", color: '#4CAF50', type: 'header' },
    { label: "Sales Revenue", valueKey: "salesRevenue", type: 'item' },
    { label: "Other Operating Income", valueKey: "otherIncome", type: 'item' },
    
    { title: "Cost of Goods Sold (COGS)", color: '#FF9800', type: 'header', showValue: false },
    { label: "Opening Stock", valueKey: "openingStock", type: 'sub_item' },
    { label: "Net Purchases", valueKey: "netPurchases", type: 'sub_item' },
    { label: "Closing Stock", valueKey: "closingStock", type: 'sub_item_deduction' },
    
    { title: "Operating Expenses", color: GARNISH_RED, type: 'header' },
    { label: "Salaries & Wages", valueKey: "salaries", type: 'item_expense' },
    { label: "Rent Expense", valueKey: "rent", type: 'item_expense' },
    { label: "Utilities", valueKey: "utilities", type: 'item_expense' },
    { label: "Interest Paid (Finance Cost)", valueKey: "interestPaid", type: 'item_expense' },
];

export default function ProfitLossScreen(){
    const [reportData, setReportData] = useState(mockFinancialData);
    const [dateRange, setDateRange] = useState("01/04/2024 - 31/03/2025"); // Mocked state

    // --- Report Calculation Logic ---
    const { grossProfit, cogs, totalExpenses, netProfit } = useMemo(() => {
        const cogsCalc = reportData.openingStock + reportData.netPurchases - reportData.closingStock;
        
        const grossProfitCalc = reportData.salesRevenue - cogsCalc;
        
        const totalExpensesCalc = reportData.salaries + reportData.rent + reportData.utilities + reportData.interestPaid;
        
        const netProfitCalc = grossProfitCalc + reportData.otherIncome - totalExpensesCalc; // (GP + Other Income) - Expenses

        return {
            grossProfit: grossProfitCalc,
            cogs: cogsCalc,
            totalExpenses: totalExpensesCalc,
            netProfit: netProfitCalc,
        };
    }, [reportData]);

    const handleGenerateReport = () => {
        // In a real app, this would fetch the actual ledger data for the selected range.
        alert(`Generating P&L for ${dateRange}. (Using Mock Data)`);
    };
    
    // Helper to render report lines
    const renderReportLine = (line: typeof reportStructure[0], value: number) => {
        if (line.type === 'header') {
            return (
                <View key={line.title} style={styles.headerRow}>
                    <Text style={[styles.headerText, { color: line.color }]}>{line.title?.toUpperCase()}</Text>
                    {line.showValue !== false && (
                        <Text style={[styles.headerText, { color: line.color }]}>VALUE</Text>
                    )}
                </View>
            );
        }

        const isDeduction = line.type === 'item_expense' || line.type === 'sub_item_deduction';
        const displayValue = Math.abs(value).toFixed(2);
        const iconName = isDeduction ? 'minus-circle-outline' : 'plus-circle-outline';
        const valueColor = isDeduction ? '#666' : '#4CAF50';
        
        return (
            <View key={line.valueKey} style={styles.dataRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name={iconName} size={14} color={isDeduction ? GARNISH_RED : '#4CAF50'} style={{ marginRight: 8 }} />
                    <Text style={[styles.dataLabel, line.type === 'sub_item' || line.type === 'sub_item_deduction' ? styles.subItemLabel : {}]}>{line.label}</Text>
                </View>
                <Text style={styles.dataValue}>₹{displayValue}</Text>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <AppHeader title="Profit & Loss Statement" />
            
            <View style={styles.actionHeader}>
                {/* Simulated Date Range Selector */}
                <View style={styles.dateRangeContainer}>
                    <MaterialCommunityIcons name="calendar-range" size={20} color={DARK_TEXT} style={{ marginRight: 8 }} />
                    <Text style={styles.dateRangeText}>Period: **{dateRange}**</Text>
                </View>
                
               
            </View>
             <Button 
                    mode="contained" 
                    onPress={handleGenerateReport} 
                    style={{ backgroundColor: GARNISH_RED }}
                    labelStyle={{ color:"#fff"}}
                    icon={() => <MaterialCommunityIcons name="refresh" size={20} color={CARD_BG} />}
                >
                    Generate Report
                </Button>

            <ScrollView style={styles.scrollView}>
                <View style={styles.paddingContainer}>
                    <Title style={styles.mainTitle}>Statement for the Period</Title>
                    <Paragraph style={styles.description}>Shows revenue, costs, and expenses incurred during a specific period.</Paragraph>
                    
                    <Card style={styles.reportCard}>
                        <View style={styles.reportSection}>
                            {reportStructure.map(line => {
                                // @ts-ignore
                                const value = reportData[line.valueKey] !== undefined ? reportData[line.valueKey] : 0;
                                
                                return renderReportLine(line, value);
                            })}
                        </View>
                        
                        {/* --- Calculated Totals --- */}
                        <Divider style={styles.totalDivider} />

                        {/* Gross Profit */}
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>GROSS PROFIT</Text>
                            <Text style={styles.summaryValue}>₹{grossProfit.toFixed(2)}</Text>
                        </View>
                        
                        {/* COGS (Displayed after Gross Profit for clarity) */}
                        <View style={styles.calculatedRow}>
                            <Text style={styles.calculatedLabel}>Calculated COGS</Text>
                            <Text style={styles.calculatedValue}>₹{cogs.toFixed(2)}</Text>
                        </View>
                        <View style={styles.calculatedRow}>
                            <Text style={styles.calculatedLabel}>Total Operating Expenses</Text>
                            <Text style={styles.calculatedValue}>₹{totalExpenses.toFixed(2)}</Text>
                        </View>


                        <Divider style={styles.finalDivider} />

                        {/* NET PROFIT/LOSS */}
                        <View style={styles.netProfitRow}>
                            <Text style={styles.netProfitLabel}>NET PROFIT / (LOSS)</Text>
                            <Text style={[styles.netProfitValue, { color: netProfit >= 0 ? BALANCE_DEBIT_COLOR : BALANCE_CREDIT_COLOR }]}>
                                ₹{Math.abs(netProfit).toFixed(2)} {netProfit >= 0 ? '(P)' : '(L)'}
                            </Text>
                        </View>

                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

// --- STYLESHEET ---
const BALANCE_DEBIT_COLOR = '#4CAF50'; 
const BALANCE_CREDIT_COLOR = GARNISH_RED;

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: LIGHT_BG },
    actionHeader: {
        padding: 12,
        backgroundColor: CARD_BG,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dateRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateRangeText: {
        fontSize: 14,
        color: DARK_TEXT,
        fontWeight: '600',
    },
    scrollView: { flex: 1 },
    paddingContainer: { padding: 12 },
    mainTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: DARK_TEXT,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    
    // --- Report Card Styles ---
    reportCard: {
        borderRadius: 10,
        elevation: 2,
        backgroundColor: CARD_BG,
        padding: 15,
    },
    reportSection: {
        marginBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 5,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    dataLabel: {
        fontSize: 15,
        color: DARK_TEXT,
    },
    subItemLabel: {
        marginLeft: 25,
        fontStyle: 'italic',
        fontSize: 14,
        color: '#666',
    },
    dataValue: {
        fontSize: 15,
        fontWeight: '600',
        color: DARK_TEXT,
    },
    
    // --- Summary Totals ---
    totalDivider: {
        marginVertical: 10,
        backgroundColor: '#ccc',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    summaryLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DARK_TEXT,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: BALANCE_DEBIT_COLOR, // Green for Gross Profit
    },
    
    calculatedRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2,
        paddingLeft: 10,
    },
    calculatedLabel: {
        fontSize: 13,
        color: '#999',
    },
    calculatedValue: {
        fontSize: 13,
        color: '#999',
    },

    // --- Final Net Profit ---
    finalDivider: {
        marginVertical: 10,
        backgroundColor: GARNISH_RED,
        height: 2,
    },
    netProfitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    netProfitLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DARK_TEXT,
    },
    netProfitValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});