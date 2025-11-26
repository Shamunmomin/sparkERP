// app/payroll/PayrollScreen.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Divider } from 'react-native-paper';
import AppHeader from './Header'; // Assuming AppHeader is available
import { getData } from './storage'; // Assuming storage functions exist

// --- THEME COLORS ---
const GARNISH_RED = '#D32F2F'; 
const DARK_TEXT = '#1F1F1F';
const LIGHT_BG = '#F7F7F7';
const CARD_BG = '#FFFFFF';
const CARD_MARGIN = 12;

// Define the Employee structure (expanded with mock data fields)
type Employee = {
    id: string;
    name: string;
    designation: string;
    salary: number;
    status: 'Active' | 'On Leave' | 'Terminated';
    lastPaid: string;
};

// Mock Employee Data
const mockEmployees: Employee[] = [
    { id: 'EMP-001', name: 'Alia Bhatt', designation: 'General Manager', salary: 75000, status: 'Active', lastPaid: '2025-10-31' },
    { id: 'EMP-002', name: 'Shah Rukh Khan', designation: 'Sales Executive', salary: 35000, status: 'Active', lastPaid: '2025-10-31' },
    { id: 'EMP-003', name: 'Priyanka Chopra', designation: 'Inventory Clerk', salary: 28000, status: 'On Leave', lastPaid: '2025-09-30' },
    { id: 'EMP-004', name: 'Salman Khan', designation: 'Accountant', salary: 45000, status: 'Active', lastPaid: '2025-10-31' },
];

export default function PayrollScreen(){
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    // const [name, setName] = useState(''); // Input removed for cleaner design

    useEffect(() => {
        (async () => {
            // In a real app, you would load stored employee data here
            const stored = await getData('payroll_employees');
            if (stored) setEmployees(stored.map((e: any) => ({...e, 
                // Add mock data if missing for demo consistency
                designation: e.designation || 'Staff', 
                salary: e.salary || 30000,
                status: e.status || 'Active',
                lastPaid: e.lastPaid || 'N/A'
            })));
        })();
    }, []);

    const handleAction = (action: string) => {
        // In a real app, this would navigate to the appropriate screen or trigger a process
        alert(`${action} action triggered!`);
    };

    // Helper to get status color
    const getStatusColor = (status: Employee['status']) => {
        switch (status) {
            case 'Active': return '#4CAF50';
            case 'On Leave': return '#FF9800';
            case 'Terminated': return GARNISH_RED;
            default: return '#666';
        }
    };
    
    // --- Render Employee Card ---
    const renderItem = ({ item }: { item: Employee }) => {
        const statusColor = getStatusColor(item.status);
        
        return (
            <Card style={styles.employeeCard}>
                <TouchableOpacity 
                    onPress={() => handleAction(`View Employee: ${item.name}`)} 
                    style={styles.touchableArea}
                >
                    <View style={styles.cardContent}>
                        {/* Left Side: Name, Designation & Status */}
                        <View style={styles.nameDetailContainer}>
                            <Text style={styles.employeeNameText}>{item.name}</Text>
                            <Text style={styles.designationText}>{item.designation}</Text>
                            <View style={styles.statusBadge}>
                                <MaterialCommunityIcons name="circle" size={10} color={statusColor} style={{ marginRight: 4 }} />
                                <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
                            </View>
                        </View>
                        
                        {/* Right Side: Salary & Last Paid */}
                        <View style={styles.salaryContainer}>
                            <Text style={styles.salaryValue}>₹{item.salary.toLocaleString('en-IN')}</Text>
                            <Text style={styles.salaryLabel}>Monthly Gross</Text>
                            <Text style={styles.lastPaidText}>Last Paid: {item.lastPaid}</Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color={GARNISH_RED} />
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={styles.screen}>
            <AppHeader title="Payroll Management" />
            
            <View style={styles.paddingContainer}>
                
                {/* 1. Key Payroll Actions */}
                <Text style={styles.sectionTitle}>Payroll Actions</Text>
                <View style={styles.actionGrid}>
                    <Button 
                        mode="contained" 
                        onPress={() => handleAction('Process Monthly Pay')} 
                        style={[styles.actionButton, { backgroundColor: GARNISH_RED }]}
                        labelStyle={{ color:"#fff"}}
                        icon={() => <MaterialCommunityIcons name="cash-multiple" size={20} color={CARD_BG} />}
                    >
                        Process Pay
                    </Button>
                    <Button 
                        mode="outlined" 
                        onPress={() => handleAction('View Pay Slips')} 
                        style={styles.actionButton}
                        labelStyle={{ color: GARNISH_RED }}
                        
                        icon={() => <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color={GARNISH_RED} />}
                    >
                        Pay Slips
                    </Button>
                </View>

                <Divider style={styles.divider} />
                
                {/* 2. Employee Master List */}
                <Text style={styles.sectionTitle}>Employee Master ({employees.length})</Text>
                <Button 
                    mode="text" 
                    onPress={() => handleAction('Add/Edit Employee Details')} 
                    style={styles.addEmployeeButton}
                    labelStyle={{ color: DARK_TEXT, fontSize: 14 }}
                    icon={() => <MaterialCommunityIcons name="account-plus" size={20} color={DARK_TEXT} />}
                >
                    Add/Edit Employee Details
                </Button>

                <FlatList
                    data={employees}
                    keyExtractor={(i) => i.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Card style={styles.emptyCard}>
                            <Text style={styles.emptyText}>
                                <MaterialCommunityIcons name="account-multiple-outline" size={18} color="#999" /> No employees found in the master list.
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
        padding: CARD_MARGIN
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DARK_TEXT,
        marginBottom: 8,
    },
    
    // --- Action Grid Styles ---
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: CARD_MARGIN,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: GARNISH_RED,
    },
    divider: {
        marginVertical: CARD_MARGIN,
        backgroundColor: '#eee',
    },
    addEmployeeButton: {
        alignSelf: 'flex-start',
        marginBottom: CARD_MARGIN,
        // Text mode allows the button to look like a link/action bar
    },

    // --- Employee List Styles ---
    listContent: {
        paddingBottom: 20,
    },
    employeeCard: { 
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
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    nameDetailContainer: {
        flex: 1,
    },
    employeeNameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DARK_TEXT,
    },
    designationText: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    salaryContainer: {
        alignItems: 'flex-end',
    },
    salaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DARK_TEXT,
    },
    salaryLabel: {
        fontSize: 12,
        color: GARNISH_RED, // Highlight the core value
    },
    lastPaidText: {
        fontSize: 10,
        color: '#999',
        marginTop: 4,
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