import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Card
 * Props:
 *  - title: string
 *  - subtitle: string
 *  - children: ReactNode
 *  - onPress: () => void
 *  - variant: 'default' | 'outlined' | 'elevated' | 'flat'
 *  - headerRight: ReactNode
 *  - footer: ReactNode
 *  - padding: number
 *  - style: object
 */

const Card = ({
  title,
  subtitle,
  children,
  onPress,
  variant = 'elevated',
  headerRight,
  footer,
  padding = 16,
  style,
}) => {
  const variantStyle = {
    default:  {},
    outlined: { borderWidth: 1.5, borderColor: '#E2E8F0', shadowOpacity: 0 },
    elevated: {
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
    },
    flat: { backgroundColor: '#F8FAFC', shadowOpacity: 0 },
  };

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[styles.card, variantStyle[variant] || {}, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Header */}
      {(title || headerRight) && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
        </View>
      )}

      {/* Divider after header */}
      {(title || headerRight) && children && (
        <View style={styles.divider} />
      )}

      {/* Body */}
      {children && (
        <View style={{ padding }}>{children}</View>
      )}

      {/* Footer */}
      {footer && (
        <>
          <View style={styles.divider} />
          <View style={styles.footer}>{footer}</View>
        </>
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: { flex: 1 },
  headerRight: { marginLeft: 12 },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  footer: { paddingHorizontal: 16, paddingVertical: 12 },
});

export default Card;