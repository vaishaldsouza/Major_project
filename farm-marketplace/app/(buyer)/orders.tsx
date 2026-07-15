import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';
import api from '../services/api';

interface OrderItem {
  product: {
    name: string;
    price: number;
    unit: string;
  };
  quantity: number;
  price: number;
  unit: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cash' | 'bank_transfer' | 'blockchain';
  blockchainTxHash?: string;
  blockchainOrderId?: number;
  items: OrderItem[];
  createdAt: string;
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/buyer');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/orders/buyer');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
      if (onOk) onOk();
    } else {
      // confirm dialog style alert
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const cancelAction = async () => {
      try {
        setLoading(true);
        const response = await api.put(`/orders/${orderId}/cancel`);
        if (response.data.success) {
          showAlert('Success', 'Order cancelled successfully. Refund initiated if paid on-chain!');
          fetchOrders();
        }
      } catch (error: any) {
        console.error('Cancel order failed:', error);
        const errorMsg = error.response?.data?.message || 'Failed to cancel order.';
        showAlert('Error', errorMsg);
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
      if (confirmCancel) {
        cancelAction();
      }
    } else {
      // standard react native confirm dialog
      cancelAction();
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#2E7D32';
      case 'pending':
        return '#EF6C00';
      case 'confirmed':
      case 'processing':
      case 'shipped':
        return '#0277BD';
      case 'cancelled':
        return '#C62828';
      default:
        return Colors.gray;
    }
  };

  const renderOrderItem = (item: OrderItem, index: number) => (
    <View key={index} style={styles.itemRow}>
      <Text style={styles.itemText} numberOfLines={1}>
        {item.product?.name || 'Product'} x {item.quantity}
      </Text>
      <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  const renderOrderCard = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>Ordered on {formatDate(item.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.itemsSection}>
        {item.items.map((orderItem, idx) => renderOrderItem(orderItem, idx))}
      </View>

      <View style={styles.paymentInfoRow}>
        <Text style={styles.paymentMethodLabel}>
          Payment: <Text style={styles.paymentMethodValue}>{item.paymentMethod.replace('_', ' ').toUpperCase()}</Text>
        </Text>
        <Text style={styles.totalPrice}>₹{item.totalAmount.toFixed(2)}</Text>
      </View>

      {/* Blockchain Details Section */}
      {item.paymentMethod === 'blockchain' && (
        <View style={styles.blockchainDetails}>
          <View style={styles.blockchainHeader}>
            <Ionicons name="link-outline" size={14} color="#2E7D32" />
            <Text style={styles.blockchainTitle}>Smart Escrow Verified</Text>
          </View>
          {item.blockchainOrderId !== undefined && item.blockchainOrderId !== null && (
            <Text style={styles.blockchainDetailText}>
              On-Chain Escrow ID: <Text style={styles.blockchainValue}>#{item.blockchainOrderId}</Text>
            </Text>
          )}
          {item.blockchainTxHash ? (
            <View style={styles.txRow}>
              <Text style={styles.blockchainDetailText} numberOfLines={1}>
                Tx Hash: <Text style={styles.blockchainValue}>{item.blockchainTxHash}</Text>
              </Text>
            </View>
          ) : (
            <Text style={styles.blockchainDetailText}>
              Tx Hash: <Text style={styles.blockchainValue}>Processing...</Text>
            </Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      {(item.status === 'pending' || item.status === 'confirmed') && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => handleCancelOrder(item._id)}
        >
          <Text style={styles.cancelBtnText}>Cancel Order & Refund</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(buyer)')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.secondary} />
          <Text style={styles.loadingText}>Fetching order details...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="receipt-outline" size={60} color={Colors.gray} />
          <Text style={styles.noOrdersTitle}>No Orders Placed Yet</Text>
          <Text style={styles.noOrdersDesc}>When you purchase products, they will appear here along with blockchain transaction status.</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push('/(buyer)/browse')}
          >
            <Text style={styles.shopBtnText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Layout.spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  loadingText: {
    marginTop: Layout.spacing.md,
    color: Colors.gray,
  },
  noOrdersTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
    marginTop: Layout.spacing.md,
  },
  noOrdersDesc: {
    color: Colors.gray,
    textAlign: 'center',
    marginTop: Layout.spacing.xs,
    lineHeight: 18,
    marginBottom: Layout.spacing.lg,
  },
  shopBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.sm,
  },
  shopBtnText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
  },
  listContainer: {
    padding: Layout.spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  orderNumber: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
  },
  orderDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.xs,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  itemsSection: {
    marginBottom: Layout.spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  itemText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.black,
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  itemPrice: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: Colors.black,
  },
  paymentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  paymentMethodLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray,
  },
  paymentMethodValue: {
    fontWeight: 'bold',
    color: Colors.black,
  },
  totalPrice: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.secondary,
  },
  blockchainDetails: {
    backgroundColor: '#E8F5E9',
    borderRadius: Layout.borderRadius.sm,
    padding: Layout.spacing.md,
    marginVertical: Layout.spacing.sm,
  },
  blockchainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  blockchainTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
    marginLeft: 4,
  },
  blockchainDetailText: {
    fontSize: 10,
    color: '#555',
    marginVertical: 2,
  },
  blockchainValue: {
    fontWeight: '700',
    color: '#2E7D32',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#C62828',
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
    marginTop: Layout.spacing.md,
  },
  cancelBtnText: {
    color: '#C62828',
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
  },
}) as any;
