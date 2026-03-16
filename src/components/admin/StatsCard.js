import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * StatsCard
 * Props:
 *  - title: string
 *  - value: string | number
 *  - subtitle: string
 *  - icon: string (emoji)
 *  - color: string (hex)
 *  - trend: { value: number, isUp: boolean } | null
 *  - onPress: () => void
 */

const StatsCard = ({
  title = 'Total Students',
  value = 0,
  subtitle = '',
  icon = '📊',
  color = '#1D4ED8',
  trend = null,
  onPress,
}) => {
  const bg = color + '15'; // light tint

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {/* Icon circle */}
      <View style={[styles.iconCircle, { backgroundColor: bg }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {/* Trend */}
      {trend && (
        <View style={[styles.trendBadge, { backgroundColor: trend.isUp ? '#F0FDF4' : '#FFF1F2' }]}>
          <Text style={{ fontSize: 12 }}>{trend.isUp ? '↑' : '↓'}</Text>
          <Text style={[styles.trendText, { color: trend.isUp ? '#15803D' : '#BE123C' }]}>
            {Math.abs(trend.value)}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 6,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: { fontSize: 22 },
  content: { flex: 1 },
  title: { fontSize: 12, color: '#64748B', fontWeight: '500', marginBottom: 4 },
  value: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 2,
  },
  trendText: { fontSize: 12, fontWeight: '700' },
});

export default StatsCard;