import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * StatusBadge
 * Props:
 *  - status: 'pending' | 'approved' | 'rejected' | 'incomplete' | 'active' | 'inactive' | string
 *  - label: string (override default label)
 *  - size: 'sm' | 'md' | 'lg'
 *  - showDot: boolean
 *  - showIcon: boolean
 *  - style: object
 */

const STATUS_MAP = {
  pending:    { label: 'Pending',    color: '#C2410C', bg: '#FFF7ED', dot: '#F97316', icon: '⏳' },
  approved:   { label: 'Approved',   color: '#15803D', bg: '#F0FDF4', dot: '#22C55E', icon: '✅' },
  rejected:   { label: 'Rejected',   color: '#BE123C', bg: '#FFF1F2', dot: '#F43F5E', icon: '❌' },
  incomplete: { label: 'Incomplete', color: '#64748B', bg: '#F8FAFC', dot: '#94A3B8', icon: '⚠️' },
  active:     { label: 'Active',     color: '#0369A1', bg: '#F0F9FF', dot: '#0EA5E9', icon: '🟢' },
  inactive:   { label: 'Inactive',   color: '#71717A', bg: '#F4F4F5', dot: '#A1A1AA', icon: '⚫' },
  verified:   { label: 'Verified',   color: '#1D4ED8', bg: '#EFF6FF', dot: '#3B82F6', icon: '🔵' },
};

const SIZES = {
  sm: { paddingHorizontal: 6,  paddingVertical: 2,  fontSize: 10, dotSize: 5,  iconSize: 10 },
  md: { paddingHorizontal: 10, paddingVertical: 4,  fontSize: 12, dotSize: 7,  iconSize: 13 },
  lg: { paddingHorizontal: 14, paddingVertical: 6,  fontSize: 14, dotSize: 9,  iconSize: 16 },
};

const StatusBadge = ({
  status = 'pending',
  label,
  size = 'md',
  showDot = true,
  showIcon = false,
  style,
}) => {
  const config = STATUS_MAP[status] || {
    label: status,
    color: '#64748B',
    bg: '#F1F5F9',
    dot: '#94A3B8',
    icon: '●',
  };

  const s = SIZES[size] || SIZES.md;
  const displayLabel = label || config.label;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          paddingHorizontal: s.paddingHorizontal,
          paddingVertical: s.paddingVertical,
        },
        style,
      ]}
    >
      {showIcon && (
        <Text style={[styles.icon, { fontSize: s.iconSize }]}>{config.icon}</Text>
      )}
      {showDot && !showIcon && (
        <View
          style={[
            styles.dot,
            { backgroundColor: config.dot, width: s.dotSize, height: s.dotSize, borderRadius: s.dotSize / 2 },
          ]}
        />
      )}
      <Text style={[styles.label, { color: config.color, fontSize: s.fontSize }]}>
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    alignSelf: 'flex-start',
    gap: 5,
  },
  dot: {},
  icon: { lineHeight: 18 },
  label: { fontWeight: '600' },
});

export default StatusBadge;