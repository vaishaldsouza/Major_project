import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, role: 'farmer' | 'buyer' | 'admin') => {
    setIsLoading(true);
    try {
      // For admin
      if (role === 'admin') {
        if (email === 'admin@farm.com' && password === 'admin123') {
          const adminUser: User = {
            id: 'admin_1',
            name: 'Admin',
            email,
            mobile: '0000000000',
            address: 'Admin Address',
            role: 'admin',
          };
          await AsyncStorage.setItem('currentUser', JSON.stringify(adminUser));
          setUser(adminUser);
          return;
        }
        throw new Error('Invalid admin credentials');
      }

      // For farmer or buyer
      const storageKey = role === 'farmer' ? 'farmers' : 'buyers';
      const storedData = await AsyncStorage.getItem(storageKey);
      const users = storedData ? JSON.parse(storedData) : [];

      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (foundUser) {
        const loggedUser: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          mobile: foundUser.mobile,
          address: foundUser.address,
          role: role,
        };
        await AsyncStorage.setItem('currentUser', JSON.stringify(loggedUser));
        setUser(loggedUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (userData: Partial<User>, role: 'farmer' | 'buyer') => {
    setIsLoading(true);
    try {
      const storageKey = role === 'farmer' ? 'farmers' : 'buyers';
      const storedData = await AsyncStorage.getItem(storageKey);
      const users = storedData ? JSON.parse(storedData) : [];

      // Check if email exists
      if (users.find((u: any) => u.email === userData.email)) {
        throw new Error('Email already registered');
      }

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem(storageKey, JSON.stringify(users));

      // Auto-login after registration
      const loggedUser: User = {
        id: newUser.id,
        name: newUser.name || '',
        email: newUser.email || '',
        mobile: newUser.mobile || '',
        address: newUser.address || '',
        role: role,
      };
      await AsyncStorage.setItem('currentUser', JSON.stringify(loggedUser));
      setUser(loggedUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};