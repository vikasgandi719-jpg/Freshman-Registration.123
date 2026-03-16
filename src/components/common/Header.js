import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, StatusBar, Platform,
} from 'react-native';

/**
 * Header
 * Props:
 *  - title: string
 *  - subtitle: string
 *  - onBack: () => void
 *  - rightComponent: ReactNode
 *  - variant: 'default' | 'transparent' | 'dark'
 *  - showBorder: boolean
 */

const Header = ({
  title = '',
  subtitle = null,
  onBack = null,
  rightComponent = null,
  variant = 'default',
  showBorder = true,
}) => {
  const isDark = variant === 'dark';

  return (
    <View
      style={[
        styles.container,
        isDark && styles.containerDark,
        variant === 'transparent' && styles.containerTransparent,
        showBorder && !isDark && styles.containerBorder,
      ]}
    >
      {/* Left: back button */}
      <View style={styles.side}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.75}>
            <Text style={[styles.backIcon, isDark && styles.textLight]}>‹</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center: title */}
      <View style={styles.center}>
        <Text
          style={[styles.title, isDark && styles.textLight]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, isDark && styles.subtitleLight]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right: custom component */}
      <View style={[styles.side, styles.sideRight]}>
        {rightComponent || null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 54 : StatusBar.currentHeight + 10 || 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  containerTransparent: {
    backgroundColor: 'transparent',
  },
  containerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  side: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 26,
    color: '#1E293B',
    lineHeight: 30,
    fontWeight: '600',
    marginTop: -2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  textLight: {
    color: '#FFFFFF',
  },
  subtitleLight: {
    color: '#94A3B8',
  },
});

export default Header;