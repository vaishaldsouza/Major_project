import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

// Components
import RoleCard from '../../components/login/RoleCard';
import CustomInput from '../../components/login/CustomInput';
import PrimaryButton from '../../components/login/PrimaryButton';

// Constants
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

// Types
import { UserRole } from '../../types/auth.types';

// Hardcoded credentials for demo
const DEMO_CREDENTIALS = {
  farmer: {
    email: 'farmer@farm.com',
    password: 'farmer123',
    name: 'John Farmer',
  },
  buyer: {
    email: 'buyer@market.com',
    password: 'buyer123',
    name: 'Sarah Buyer',
  },
  admin: {
    email: 'admin@farm.com',
    password: 'admin123',
    name: 'Admin User',
  },
};

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Auto-fill credentials based on selected role
  useEffect(() => {
    if (selectedRole) {
      const credentials = DEMO_CREDENTIALS[selectedRole];
      setEmail(credentials.email);
      setPassword(credentials.password);
    }
  }, [selectedRole]);

  const handleLogin = () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate credentials
    const credentials = DEMO_CREDENTIALS[selectedRole];
    if (email === credentials.email && password === credentials.password) {
      setIsLoading(true);
      
      // Simulate login delay
      setTimeout(() => {
        setIsLoading(false);
        
        // Show success message with user name
        Alert.alert(
          'Login Successful!',
          `Welcome ${credentials.name}!`,
          [
            {
              text: 'Continue',
              onPress: () => {
                // Navigate based on role
                switch(selectedRole) {
                  case 'farmer':
                    router.replace('/(farmer)');
                    break;
                  case 'buyer':
                    router.replace('/(buyer)');
                    break;
                  case 'admin':
                    router.replace('/(admin)');
                    break;
                }
              }
            }
          ]
        );
      }, 1500);
    } else {
      Alert.alert(
        'Login Failed',
        'Invalid email or password. Please check your credentials.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google authentication will be implemented with backend integration.');
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset will be implemented with backend integration.',
      [{ text: 'OK' }]
    );
  };

  const handleRegister = () => {
    Alert.alert(
      'Register',
      'Registration will be implemented with backend integration.',
      [{ text: 'OK' }]
    );
  };

  // Show credentials helper
  const showCredentials = () => {
    Alert.alert(
      'Demo Credentials',
      '👨‍🌾 Farmer: farmer@farm.com / farmer123\n\n' +
      '🛒 Buyer: buyer@market.com / buyer123\n\n' +
      '🛡️ Admin: admin@farm.com / admin123\n\n' +
      '💡 Tip: Select a role above and credentials will auto-fill!',
      [{ text: 'Got it!' }]
    );
  };

  const roles: Array<{ id: UserRole; icon: string; label: string }> = [
    { id: 'farmer', icon: 'leaf-outline', label: 'Farmer' },
    { id: 'buyer', icon: 'cart-outline', label: 'Buyer' },
    { id: 'admin', icon: 'shield-outline', label: 'Admin' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.logoWrapper}
              >
                <Ionicons name="leaf" size={40} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.appName}>Farm Marketplace</Text>
              <Text style={styles.subtitle}>Connecting Farmers & Buyers</Text>
              
              {/* Demo Credentials Button */}
              <TouchableOpacity
                style={styles.credentialsButton}
                onPress={showCredentials}
                activeOpacity={0.8}
              >
                <Ionicons name="key-outline" size={16} color={Colors.primary} />
                <Text style={styles.credentialsButtonText}>View Demo Credentials</Text>
              </TouchableOpacity>
            </View>

            {/* Role Selection */}
            <View style={styles.roleSection}>
              <Text style={styles.sectionTitle}>Select Your Role</Text>
              <View style={styles.roleContainer}>
                {roles.map((role) => (
                  <RoleCard
                    key={role.id}
                    id={role.id}
                    icon={role.icon}
                    label={role.label}
                    isSelected={selectedRole === role.id}
                    onSelect={setSelectedRole}
                  />
                ))}
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              <CustomInput
                icon="mail-outline"
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <CustomInput
                icon="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={24}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                }
              />

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMe}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && (
                      <Ionicons name="checkmark" size={16} color={Colors.white} />
                    )}
                  </View>
                  <Text style={styles.rememberText}>Remember Me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <PrimaryButton
                title="Login"
                onPress={handleLogin}
                isLoading={isLoading}
                disabled={!selectedRole || !email || !password}
              />

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              {/* Google Login */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleLogin}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-google" size={24} color="#DB4437" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerText}> Register</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.padding * 2,
    paddingTop: Layout.padding * 2,
    paddingBottom: Layout.padding * 3,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.padding * 2,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.padding,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  appName: {
    fontSize: Typography.fontSize.xxlarge,
    fontWeight: Typography.fontWeight.bold as any,
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.fontSize.medium,
    color: Colors.gray,
    fontWeight: Typography.fontWeight.medium as any,
    marginBottom: 8,
  },
  credentialsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    marginTop: 4,
  },
  credentialsButtonText: {
    fontSize: Typography.fontSize.small,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium as any,
  },
  roleSection: {
    marginBottom: Layout.padding * 1.5,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.semibold as any,
    color: Colors.dark,
    marginBottom: Layout.padding,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formSection: {
    marginBottom: Layout.padding,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.padding * 1.5,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.gray,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  rememberText: {
    fontSize: Typography.fontSize.small,
    color: Colors.gray,
  },
  forgotText: {
    fontSize: Typography.fontSize.small,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium as any,
  },
  eyeIcon: {
    padding: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.padding * 1.5,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Layout.padding,
    color: Colors.gray,
    fontSize: Typography.fontSize.small,
    fontWeight: Typography.fontWeight.medium as any,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius,
    paddingVertical: Layout.padding * 0.8,
    paddingHorizontal: Layout.padding,
    gap: 10,
  },
  googleButtonText: {
    fontSize: Typography.fontSize.medium,
    color: Colors.dark,
    fontWeight: Typography.fontWeight.medium as any,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Layout.padding,
  },
  footerText: {
    fontSize: Typography.fontSize.medium,
    color: Colors.gray,
  },
  registerText: {
    fontSize: Typography.fontSize.medium,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold as any,
  },
});