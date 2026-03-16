import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Divider
 * Props:
 *  - label: string | null
 *  - orientation: 'horizontal' | 'vertical'
 *  - color: string
 *  - thickness: number
 *  - spacing: number
 *  - style: object
 */

const Divider = ({
  label = null,
  orientation = 'horizontal',
  color = '#E2E8F0',
  thickness = 1,
  spacing = 16,
  style,
}) => {
  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.vertical,
          { backgroundColor: color, width: thickness, marginHorizontal: spacing },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View style={[styles.labeledRow, { marginVertical: spacing }, style]}>
        <View style={[styles.line, { backgroundColor: color, height: thickness }]} />
        <Text style={styles.labelText}>{label}</Text>
        <View style={[styles.line, { backgroundColor: color, height: thickness }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        { backgroundColor: color, height: thickness, marginVertical: spacing },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: { width: '100%' },
  vertical: { alignSelf: 'stretch' },
  labeledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  line: { flex: 1 },
  labelText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    paddingHorizontal: 4,
  },
});

export default Divider;