// app/index.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import 'react-native-get-random-values';
import { Card, IconButton, Paragraph, Text } from 'react-native-paper';
// --- THEME COLORS ---
const GARNISH_RED = '#D32F2F'; // A deep, strong red (e.g., Material Red 700)
const DARK_TEXT = '#1F1F1F'; // Nearly black for high contrast text
const LIGHT_BG = '#F7F7F7'; // A very light gray background
const CARD_BG = '#FFFFFF'; // Pure white card background

// --- CONFIGURATION ---
const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const NUM_COLUMNS = 2; 
const CARD_WIDTH = (width - (CARD_MARGIN * (NUM_COLUMNS + 1))) / NUM_COLUMNS;

// Define Card data for the Grid
const cards = [
  { title: 'Products', route: '/ItemsScreen', icon: 'database' },
  { title: 'Sales', route: '/SalesDashboard', icon: 'cash-register' },
  { title: 'Purchase', route: '/PurchaseOrderScreen', icon: 'cart' },
  { title: 'Inventory', route: '/StockSummaryScreen', icon: 'warehouse' },
  { title: 'Accounting', route: '/LedgerScreen', icon: 'calculator' },
  { title: 'Payroll', route: '/PayrollScreen', icon: 'account-tie' },
  { title: 'Reports', route: '/ProfitLossScreen', icon: 'chart-bar' },
  { title: 'GST', route: '/', icon: 'file-document-box-check' },
  { title: 'POS', route: '/PosScreen', icon: 'point-of-sale' },
  { title: 'Settings', route: '/SettingsScreen', icon: 'cog' },
];

// Mock Data for the Key Performance Indicators (KPIs)
const kpiData = [
  // Keeping original semantic colors for data status (Green/Orange/Red)
  { title: "Net Sales Today", value: "₹1,25,000", trend: "+5% vs Yesterday", icon: "cash-multiple", color: '#4CAF50' }, 
  { title: "Cash In Hand", value: "₹35,000", trend: "No change", icon: "cash", color: '#2196F3' }, 
  { title: "Outstanding Receivables", value: "₹4,50,000", trend: "+2% Past Due", icon: "alert-circle", color: GARNISH_RED }, // Highlighted red
  { title: "Pending PO", value: "12 Orders", trend: "3 New Today", icon: "cart-arrow-down", color: GARNISH_RED }, // Highlighted red
];

// --- KPI Row Component ---
const KpiRow = () => {
  // const theme = useTheme(); // Not needed if colors are hardcoded/imported
  return (
     <><View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
  <MaterialCommunityIcons
    name="arrow-right-thin"
    size={12}
    color="#000"
    style={{ paddingRight: 10 }}
  />
</View>

    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.kpiContainer}
      >

        {kpiData.map((kpi) => (
          <Card key={kpi.title} style={styles.kpiCard}>
            <Card.Content style={styles.kpiContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <MaterialCommunityIcons
                  name={kpi.icon as any}
                  size={20}
                  color={kpi.color as any}
                  style={{ marginRight: 6 }} />
                <Text style={[styles.kpiTitle, { color: DARK_TEXT }]}>{kpi.title}</Text>
              </View>
              {/* KPI Value uses its specific status color */}
              <Text variant="headlineSmall" style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
              {/* KPI Trend uses its specific status color */}
              <Text style={[styles.kpiTrend, { color: kpi.color }]}>{kpi.trend}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView></>
  );
};


// --- MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
  const router = useRouter();
  // const theme = useTheme(); // Still useful if other components use the theme

  return (
    <View style={{ flex: 1, backgroundColor: LIGHT_BG }}>
      <View style={styles.header}>
        <Text style={[styles.mainTitle, { color: "#fff" }]}>
          Spark ERP 
        </Text>
        <Text style={[styles.subTitle, { color: "#eee" }]}>Business Management Dashboard</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.container}>
        {/* 2. Key Performance Indicators (KPIs) - The new data section */}
        <KpiRow />

        {/* 3. Module Grid Title */}
        <Text style={[styles.gridSectionTitle, { color: DARK_TEXT }]}>Core Modules & Functions</Text>

        {/* 4. Grid Layout for Cards */}
        <View style={styles.cardGrid}>
          {cards.map((c) => (
            <Card
              key={c.title}
              // Card background is pure white
              style={[styles.card, { backgroundColor: CARD_BG }]}
              onPress={() => router.push(c.route as any)}
            >
              <View style={styles.cardContent}>
                <IconButton
                  icon={() => (
                    <MaterialCommunityIcons
                      name={c.icon as any}
                      size={32}
                      // Icons are the Garnish Red color for brand identity
                      color={GARNISH_RED} /> 
                  )}
                  size={40}
                  style={{ marginBottom: 4 }} />
                <Paragraph style={[styles.cardTitle, { color: DARK_TEXT }]}>{c.title}</Paragraph>
                <Text variant="labelSmall" style={styles.cardActionText}>Open Module</Text>
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
  // Adjusted container to no longer be the ScrollView containerStyle
  container: {
    // padding: CARD_MARGIN / 2,
    paddingBottom: 20, // Add space at the bottom of the scroll view
  },
  header: {
    padding: CARD_MARGIN * 2,
    paddingTop:30, 
        marginBottom: CARD_MARGIN, 
    backgroundColor: "#fd1212ea",
    borderRadius: 0, // Making the top header full width, removing border radius for a sharp look
    shadowColor: DARK_TEXT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 0, // Full width header
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    color: '#666', // Muted gray for subtitle
  },
  
  // --- KPI Styles ---
  kpiContainer: {
    paddingVertical: CARD_MARGIN,
    paddingHorizontal: CARD_MARGIN / 2,
  },
  kpiCard: {
    width: 180, 
    marginHorizontal: CARD_MARGIN / 2,
    borderRadius: 12,
    backgroundColor: CARD_BG, // Pure White
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

  // --- Grid Styles ---
  gridSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: CARD_MARGIN,
    marginTop: CARD_MARGIN * 2,
    marginBottom: CARD_MARGIN,
    color: DARK_TEXT, // Black title
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: CARD_MARGIN / 2,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH, 
    margin: CARD_MARGIN / 2, 
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DARK_TEXT,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, 
    padding: CARD_MARGIN,
  },
  cardTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    color: DARK_TEXT, // Black title
  },
  cardActionText: {
    color: '#999',
    marginTop: 2,
  }
});