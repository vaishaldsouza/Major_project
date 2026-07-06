import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

interface CustomInputProps extends TextInputProps {
  icon: string;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export default function CustomInput({
  icon,
  rightIcon,
  containerStyle,
  ...props
}: CustomInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputWrapper}>
        <Ionicons
          name={icon as any}
          size={22}
          color={Colors.gray}
          style={styles.leftIcon}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.gray}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.padding,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: Layout.borderRadius,
    paddingHorizontal: Layout.padding,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: Layout.padding * 0.75,
    fontSize: Typography.fontSize.medium,
    color: Colors.dark,
  },
  rightIcon: {
    marginLeft: 8,
  },
});