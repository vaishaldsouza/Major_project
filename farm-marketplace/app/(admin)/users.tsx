import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'farmer' | 'buyer' | 'admin';
}

export default function ManageUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.role.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, users]);

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
      if (onOk) onOk();
    } else {
      // native alert
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const deleteAction = async () => {
      try {
        setLoading(true);
        const response = await api.delete(`/users/${userId}`);
        if (response.data.success) {
          showAlert('Success', 'User deleted successfully');
          fetchUsers();
        }
      } catch (error: any) {
        console.error('Error deleting user:', error);
        const errorMsg = error.response?.data?.message || 'Failed to delete user';
        showAlert('Error', errorMsg);
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm('Are you sure you want to delete this user account? This cannot be undone.');
      if (confirmDelete) {
        deleteAction();
      }
    } else {
      deleteAction();
    }
  };

  const renderUserCard = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        {item.mobile && <Text style={styles.userMobile}>Mobile: {item.mobile}</Text>}
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: item.role === 'farmer' ? '#E8F5E9' : item.role === 'buyer' ? '#E3F2FD' : '#F3E5F5' },
          ]}
        >
          <Text
            style={[
              styles.roleBadgeText,
              { color: item.role === 'farmer' ? '#2E7D32' : item.role === 'buyer' ? '#1976D2' : '#7B1FA2' },
            ]}
          >
            {item.role.toUpperCase()}
          </Text>
        </View>
      </View>

      {item.role !== 'admin' && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteUser(item._id)}
        >
          <Ionicons name="trash-outline" size={20} color="#C62828" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(admin)')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.admin} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Users</Text>
        <TouchableOpacity onPress={fetchUsers} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color={Colors.admin} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color={Colors.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor={Colors.gray}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.admin} />
          <Text style={styles.loadingText}>Fetching users...</Text>
        </View>
      ) : filteredUsers.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="people-outline" size={60} color={Colors.gray} />
          <Text style={styles.noUsersText}>No users found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderUserCard}
          contentContainerStyle={styles.listContainer}
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
  refreshButton: {
    padding: Layout.spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
  },
  searchContainer: {
    padding: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lighterGray,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: Layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
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
  noUsersText: {
    fontSize: Typography.fontSize.md,
    color: Colors.gray,
    marginTop: Layout.spacing.md,
  },
  listContainer: {
    padding: Layout.spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
    marginTop: 2,
  },
  userMobile: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.xs,
    alignSelf: 'flex-start',
    marginTop: Layout.spacing.sm,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  deleteButton: {
    padding: Layout.spacing.sm,
  },
}) as any;
