import React, { useEffect, useRef } from 'react';
import {
  View, Text, Modal as RNModal, TouchableOpacity,
  StyleSheet, Animated, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';

/**
 * Modal
 * Props:
 *  - visible: boolean
 *  - onClose: () => void
 *  - title: string
 *  - subtitle: string
 *  - children: ReactNode
 *  - footer: ReactNode
 *  - size: 'sm' | 'md' | 'lg' | 'fullscreen'
 *  - closeOnBackdrop: boolean
 *  - showCloseBtn: boolean
 *  - icon: string (emoji)
 */

const Modal = ({
  visible = false,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  showCloseBtn = true,
  icon,
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 100, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const sizeStyle = {
    sm:         { maxHeight: '40%' },
    md:         { maxHeight: '65%' },
    lg:         { maxHeight: '85%' },
    fullscreen: { flex: 1, margin: 0, borderRadius: 0 },
  };

  return (
    <RNModal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={closeOnBackdrop ? onClose : undefined}
            activeOpacity={1}
          />
        </Animated.View>

        {/* Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            sizeStyle[size] || sizeStyle.md,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          {(title || showCloseBtn || icon) && (
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                {icon && <Text style={styles.headerIcon}>{icon}</Text>}
                <View>
                  {title    && <Text style={styles.title}>{title}</Text>}
                  {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
              </View>
              {showCloseBtn && (
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Divider */}
          {title && <View style={styles.divider} />}

          {/* Body */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>

          {/* Footer */}
          {footer && (
            <>
              <View style={styles.divider} />
              <View style={styles.footer}>{footer}</View>
            </>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  handleBar: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginTop: 10, marginBottom: 4,
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  headerIcon: { fontSize: 24 },
  title: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },
  closeBtnText: { fontSize: 13, color: '#64748B', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  body: { flexGrow: 0 },
  bodyContent: { padding: 20 },
  footer: { paddingHorizontal: 20, paddingVertical: 14 },
});

export default Modal;