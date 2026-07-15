import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';
import api from '../services/api';

type PaymentMethod = 'cash' | 'bank_transfer' | 'blockchain';

export default function CheckoutScreen() {
  const params = useLocalSearchParams();
  const productId = params.productId as string;
  const productName = params.name as string;
  const productPrice = parseFloat(params.price as string);
  const productUnit = params.unit as string;
  const farmerName = params.farmerName as string;
  const maxQty = parseInt(params.availableQuantity as string, 10);

  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('blockchain');
  const [isLoading, setIsLoading] = useState(false);

  const incrementQty = () => {
    if (quantity < maxQty) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address || !city || !state || !pincode) {
      showAlert('Error', 'Please fill in all shipping address fields');
      return;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      showAlert('Error', 'Please provide a valid 6-digit pincode');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/orders', {
        items: [
          {
            productId,
            quantity,
          },
        ],
        shippingAddress: {
          address,
          city,
          state,
          pincode,
          country: 'India',
        },
        paymentMethod,
        notes,
      });

      if (response.data.success) {
        const order = response.data.order;
        let successMessage = 'Your order has been placed successfully!';
        
        if (paymentMethod === 'blockchain' && order.blockchainTxHash) {
          successMessage += `\n\n⛓️ Escrow Transaction Verified on Blockchain!\nTx Hash: ${order.blockchainTxHash.substring(0, 20)}...`;
        }

        showAlert('Success', successMessage, () => {
          router.replace('/(buyer)/orders');
        });
      }
    } catch (error: any) {
      console.error('Order creation failed:', error);
      const errorMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
      showAlert('Order Failed', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = productPrice * quantity;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{productName}</Text>
                <Text style={styles.itemSeller}>Farmer: {farmerName}</Text>
              </View>

              <View style={styles.quantityRow}>
                <Text style={styles.qtyLabel}>Quantity:</Text>
                <View style={styles.qtySelector}>
                  <TouchableOpacity onPress={decrementQty} style={styles.qtyBtn}>
                    <Ionicons name="remove" size={16} color={Colors.black} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{quantity}</Text>
                  <TouchableOpacity onPress={incrementQty} style={styles.qtyBtn}>
                    <Ionicons name="add" size={16} color={Colors.black} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.maxQty}>Max: {maxQty}</Text>
              </View>
            </View>
          </View>

          {/* Shipping Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <View style={styles.addressCard}>
              <TextInput
                style={styles.input}
                placeholder="Street Address"
                placeholderTextColor={Colors.gray}
                value={address}
                onChangeText={setAddress}
              />
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: Layout.spacing.sm }]}
                  placeholder="City"
                  placeholderTextColor={Colors.gray}
                  value={city}
                  onChangeText={setCity}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="State"
                  placeholderTextColor={Colors.gray}
                  value={state}
                  onChangeText={setState}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Pincode (6 digits)"
                placeholderTextColor={Colors.gray}
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notes for farmer (optional)"
                placeholderTextColor={Colors.gray}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Payment Method</Text>
            <View style={styles.paymentCard}>
              {/* Blockchain Escrow */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'blockchain' && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentMethod('blockchain')}
              >
                <View style={styles.paymentOptionHeader}>
                  <Ionicons
                    name="link"
                    size={20}
                    color={paymentMethod === 'blockchain' ? Colors.secondary : Colors.gray}
                  />
                  <Text
                    style={[
                      styles.paymentOptionText,
                      paymentMethod === 'blockchain' && styles.paymentOptionTextActive,
                    ]}
                  >
                    Blockchain Smart Escrow
                  </Text>
                </View>
                <Text style={styles.paymentDesc}>
                  Funds are secured on-chain and only released to the farmer after you verify receipt.
                </Text>
              </TouchableOpacity>

              {/* Cash on Delivery */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'cash' && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentMethod('cash')}
              >
                <View style={styles.paymentOptionHeader}>
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color={paymentMethod === 'cash' ? Colors.secondary : Colors.gray}
                  />
                  <Text
                    style={[
                      styles.paymentOptionText,
                      paymentMethod === 'cash' && styles.paymentOptionTextActive,
                    ]}
                  >
                    Cash on Delivery
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Bank Transfer */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'bank_transfer' && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentMethod('bank_transfer')}
              >
                <View style={styles.paymentOptionHeader}>
                  <Ionicons
                    name="business-outline"
                    size={20}
                    color={paymentMethod === 'bank_transfer' ? Colors.secondary : Colors.gray}
                  />
                  <Text
                    style={[
                      styles.paymentOptionText,
                      paymentMethod === 'bank_transfer' && styles.paymentOptionTextActive,
                    ]}
                  >
                    Direct Bank Transfer
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pricing Details & Checkout Button */}
          <View style={styles.totalCard}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Price ({quantity} x ₹{productPrice})</Text>
              <Text style={styles.pricingValue}>₹{totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Delivery Fee</Text>
              <Text style={[styles.pricingValue, { color: '#2E7D32' }]}>Free</Text>
            </View>
            <View style={[styles.pricingRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>₹{totalPrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handlePlaceOrder}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.checkoutBtnText}>Place Escrow Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: Layout.spacing.md,
  },
  section: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
    marginBottom: Layout.spacing.sm,
  },
  itemCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemHeader: {
    marginBottom: Layout.spacing.md,
  },
  itemName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
  },
  itemSeller: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.black,
    marginRight: Layout.spacing.md,
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.lighterGray,
  },
  qtyBtn: {
    padding: Layout.spacing.sm,
  },
  qtyText: {
    paddingHorizontal: Layout.spacing.md,
    fontWeight: 'bold',
    fontSize: Typography.fontSize.md,
  },
  maxQty: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray,
    marginLeft: Layout.spacing.md,
  },
  addressCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    backgroundColor: Colors.lighterGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.sm,
    height: 48,
    paddingHorizontal: Layout.spacing.md,
    fontSize: Typography.fontSize.sm,
    color: Colors.black,
    marginBottom: Layout.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  textArea: {
    height: 80,
    paddingTop: Layout.spacing.sm,
    textAlignVertical: 'top',
  },
  paymentCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.sm,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  paymentOptionActive: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary + '05',
  },
  paymentOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentOptionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.gray,
    marginLeft: Layout.spacing.sm,
  },
  paymentOptionTextActive: {
    color: Colors.secondary,
  },
  paymentDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray,
    marginLeft: 28,
    lineHeight: 16,
  },
  totalCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.xxl,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  pricingLabel: {
    color: Colors.gray,
    fontSize: Typography.fontSize.sm,
  },
  pricingValue: {
    fontWeight: 'bold',
    fontSize: Typography.fontSize.sm,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Layout.spacing.md,
    marginTop: Layout.spacing.sm,
  },
  grandTotalLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
  },
  grandTotalValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.secondary,
  },
  checkoutBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
  },
  checkoutBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Typography.fontSize.md,
  },
}) as any;
