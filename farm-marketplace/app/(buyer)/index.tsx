import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

export default function BuyerDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛒 Buyer Dashboard</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Ionicons name="log-out-outline" size={24} color={Colors.error} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Ionicons name="cart" size={48} color={Colors.white} />
          <Text style={styles.cardTitle}>Welcome Buyer!</Text>
          <Text style={styles.cardSubtitle}>Browse products and place orders</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
        </View>
        
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>Buyer Dashboard</Text>
          <Text style={styles.placeholderSubtext}>Discover farm fresh products</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.padding * 2,
    paddingVertical: Layout.padding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.fontSize.xlarge,
    fontWeight: Typography.fontWeight.bold as any,
    color: Colors.dark,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: Layout.padding * 2,
  },
  card: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius,
    padding: Layout.padding * 2,
    alignItems: 'center',
    marginBottom: Layout.padding * 2,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xlarge,
    fontWeight: Typography.fontWeight.bold as any,
    color: Colors.white,
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.medium,
    color: Colors.white,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.padding * 2,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
    borderRadius: Layout.borderRadius,
    padding: Layout.padding,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: Typography.fontSize.xlarge,
    fontWeight: Typography.fontWeight.bold as any,
    color: Colors.dark,
  },
  statLabel: {
    fontSize: Typography.fontSize.small,
    color: Colors.gray,
    marginTop: 4,
  },
  placeholderCard: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Layout.borderRadius,
    padding: Layout.padding * 2,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: Typography.fontSize.large,
    color: Colors.gray,
    fontWeight: Typography.fontWeight.medium as any,
  },
  placeholderSubtext: {
    fontSize: Typography.fontSize.medium,
    color: Colors.lightGray,
    marginTop: 8,
  },
});