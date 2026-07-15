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
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';
import api from '../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  isOrganic: boolean;
  blockchainId?: number;
  blockchainTxHash?: string;
  images?: string[];
  location: {
    address: string;
  };
}

export default function MyProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/farmer/my-products');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching my products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/products/farmer/my-products');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const deleteAction = async () => {
      try {
        setLoading(true);
        const response = await api.delete(`/products/${productId}`);
        if (response.data.success) {
          showAlert('Success', 'Product listing deleted successfully');
          fetchMyProducts();
        }
      } catch (error: any) {
        console.error('Delete product failed:', error);
        const errMsg = error.response?.data?.message || 'Failed to delete product.';
        showAlert('Error', errMsg);
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm('Are you sure you want to delete this product listing?');
      if (confirmDelete) {
        deleteAction();
      }
    } else {
      deleteAction();
    }
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      {item.images && item.images[0] ? (
        <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="leaf-outline" size={40} color={Colors.primary} />
          <Text style={styles.placeholderText}>Farm Fresh Produce</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.categoryText}>Category: {item.category.toUpperCase()}</Text>
        </View>
        {item.isOrganic && (
          <View style={styles.organicBadge}>
            <Text style={styles.organicText}>Organic</Text>
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          📍 Location: {item.location.address}
        </Text>
        <Text style={styles.infoText}>
          📦 Stock: {item.quantity} {item.unit}
        </Text>
      </View>

      {/* Blockchain Details Section */}
      <View style={styles.blockchainDetails}>
        {item.blockchainId !== undefined && item.blockchainId !== null ? (
          <View>
            <View style={styles.blockchainHeader}>
              <Ionicons name="link-outline" size={14} color="#2E7D32" />
              <Text style={styles.blockchainTitle}>On-Chain Registered</Text>
            </View>
            <Text style={styles.blockchainDetailText}>
              Blockchain Product ID: <Text style={styles.blockchainValue}>#{item.blockchainId}</Text>
            </Text>
            {item.blockchainTxHash && (
              <Text style={styles.blockchainDetailText} numberOfLines={1}>
                Tx Hash: <Text style={styles.blockchainValue}>{item.blockchainTxHash}</Text>
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.blockchainHeader}>
            <Ionicons name="server-outline" size={14} color="#666" />
            <Text style={[styles.blockchainTitle, { color: '#666' }]}>Database Only</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.price}>
          ₹{item.price} <Text style={styles.unit}>/ {item.unit}</Text>
        </Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDeleteProduct(item._id)}
        >
          <Ionicons name="trash-outline" size={20} color="#C62828" />
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(farmer)')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Products</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching products...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cube-outline" size={60} color={Colors.gray} />
          <Text style={styles.noProductsTitle}>No Products Listed</Text>
          <Text style={styles.noProductsDesc}>Add fresh produce to start listing items on the marketplace.</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/(farmer)/add-product')}
          >
            <Text style={styles.addBtnText}>Add First Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProductCard}
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
  noProductsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
    marginTop: Layout.spacing.md,
  },
  noProductsDesc: {
    color: Colors.gray,
    textAlign: 'center',
    marginTop: Layout.spacing.xs,
    marginBottom: Layout.spacing.lg,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.sm,
  },
  addBtnText: {
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
    overflow: 'hidden',
  },
  productImage: {
    width: '120%',
    height: 160,
    marginLeft: '-10%',
    marginTop: '-10%',
    marginBottom: Layout.spacing.md,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '120%',
    height: 120,
    marginLeft: '-10%',
    marginTop: '-10%',
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  placeholderText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginTop: 4,
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
  productName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  organicBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.xs,
  },
  organicText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  description: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
    lineHeight: 18,
    marginBottom: Layout.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray,
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
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
    marginLeft: 4,
  },
  blockchainDetailText: {
    fontSize: 10,
    color: '#555',
    marginVertical: 1,
  },
  blockchainValue: {
    fontWeight: '700',
    color: '#2E7D32',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Layout.spacing.sm,
    marginTop: Layout.spacing.sm,
  },
  price: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
  },
  unit: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray,
    fontWeight: 'normal',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C62828',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.sm,
  },
  deleteBtnText: {
    color: '#C62828',
    fontWeight: 'bold',
    fontSize: Typography.fontSize.xs,
    marginLeft: 4,
  },
}) as any;
