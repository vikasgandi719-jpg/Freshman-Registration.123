import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, View,
} from 'react-native';

/**
 * Button
 * Props:
 *  - title: string
 *  - onPress: () => void
 *  - variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 *  - size: 'sm' | 'md' | 'lg'
 *  - loading: boolean
 *  - disabled: boolean
 *  - icon: string (emoji)
 *  - iconPosition: 'left' | 'right'
 *  - fullWidth: boolean
 *  - style: object
 */

const VARIANTS = {
  primary:   { bg: '#1D4ED8', text: '#FFFFFF', border: 'transparent', pressedBg: '#1E40AF' },
  secondary: { bg: '#F1F5F9', text: '#334155', border: 'transparent', pressedBg: '#E2E8F0' },
  outline:   { bg: 'transparent', text: '#1D4ED8', border: '#1D4ED8', pressedBg: '#EFF6FF' },
  ghost:     { bg: 'transparent', text: '#64748B', border: 'transparent', pressedBg: '#F8FAFC' },
  danger:    { bg: '#DC2626', text: '#FFFFFF', border: 'transparent', pressedBg: '#B91C1C' },
};

const SIZES = {
  sm: { paddingVertical: 8,  paddingHorizontal: 14, fontSize: 13, borderRadius: 8,  iconSize: 14 },
  md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 15, borderRadius: 10, iconSize: 16 },
  lg: { paddingVertical: 16, paddingHorizontal: 28, fontSize: 17, borderRadius: 12, iconSize: 20 },
};

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}) => {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: v.border === 'transparent' ? 0 : 1.5,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: s.borderRadius,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={v.text}
          size="small"
        />
      ) : (
        <View style={styles.inner}>
          {icon && iconPosition === 'left' && (
            <Text style={[styles.icon, { fontSize: s.iconSize, marginRight: title ? 6 : 0 }]}>{icon}</Text>
          )}
          {title && (
            <Text style={[styles.text, { color: v.text, fontSize: s.fontSize }]}>{title}</Text>
          )}
          {icon && iconPosition === 'right' && (
            <Text style={[styles.icon, { fontSize: s.iconSize, marginLeft: title ? 6 : 0 }]}>{icon}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  icon: {
    lineHeight: 22,
  },
});

export default Button;