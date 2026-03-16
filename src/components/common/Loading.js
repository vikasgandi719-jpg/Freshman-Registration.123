import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  Animated, Modal,
} from 'react-native';

/**
 * Loading
 * Props:
 *  - visible: boolean
 *  - message: string
 *  - variant: 'spinner' | 'overlay' | 'inline' | 'fullscreen'
 *  - size: 'small' | 'large'
 *  - color: string
 */

const Loading = ({
  visible = true,
  message = 'Loading…',
  variant = 'spinner',
  size = 'large',
  color = '#1D4ED8',
}) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.6, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 700, useNativeDriver: true }),
      ])
    );
    if (visible) anim.start();
    return () => anim.stop();
  }, [visible]);

  if (!visible) return null;

  if (variant === 'overlay') {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlayBg}>
          <View style={styles.overlayCard}>
            <ActivityIndicator size="large" color={color} />
            {message && <Text style={styles.overlayMessage}>{message}</Text>}
          </View>
        </View>
      </Modal>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <View style={styles.fullscreen}>
        <Animated.View style={[styles.logoCircle, { opacity: pulse, backgroundColor: color + '20' }]}>
          <ActivityIndicator size="large" color={color} />
        </Animated.View>
        {message && <Text style={[styles.fullscreenMessage, { color }]}>{message}</Text>}
      </View>
    );
  }

  if (variant === 'inline') {
    return (
      <View style={styles.inlineRow}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={[styles.inlineText, { color }]}>{message}</Text>}
      </View>
    );
  }

  // Default: spinner
  return (
    <View style={styles.spinnerWrapper}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.spinnerText}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerWrapper: { alignItems: 'center', paddingVertical: 20 },
  spinnerText: { fontSize: 13, color: '#64748B', marginTop: 10 },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  inlineText: { fontSize: 14, fontWeight: '500' },
  overlayBg: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  overlayCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    padding: 28, alignItems: 'center', minWidth: 160,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  overlayMessage: { fontSize: 14, color: '#334155', fontWeight: '600', marginTop: 14 },
  fullscreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  logoCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  fullscreenMessage: { fontSize: 15, fontWeight: '600' },
});

export default Loading;