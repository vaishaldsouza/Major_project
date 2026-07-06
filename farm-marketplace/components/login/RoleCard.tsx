import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { UserRole } from '../../types/auth.types';

interface RoleCardProps {
  id: UserRole;
  icon: string;
  label: string;
  isSelected: boolean;
  onSelect: (role: UserRole) => void;
}

export default function RoleCard({
  id,
  icon,
  label,
  isSelected,
  onSelect,
}: RoleCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.05 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => onSelect(id)}
        activeOpacity={0.8}
      >
        {isSelected && (
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.gradientOverlay}
          />
        )}
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon as any}
            size={32}
            color={isSelected ? Colors.white : Colors.primary}
          />
        </View>
        <Text style={[styles.label, isSelected && styles.labelSelected]}>
          {label}
        </Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48 - 24) / 3;

const styles = StyleSheet.create({
  cardWrapper: {
    width: cardWidth,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 90,
    justifyContent: 'center',
  },
  cardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.95,
  },
  iconContainer: {
    marginBottom: 6,
    zIndex: 1,
  },
  label: {
    fontSize: Typography.fontSize.small,
    color: Colors.dark,
    fontWeight: Typography.fontWeight.medium as any,
    zIndex: 1,
  },
  labelSelected: {
    color: Colors.white,
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 1,
  },
});