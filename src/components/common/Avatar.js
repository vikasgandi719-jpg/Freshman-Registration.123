import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Avatar
 * Props:
 *  - uri: string | null
 *  - name: string
 *  - size: number (default 48)
 *  - onPress: () => void
 *  - showBadge: boolean
 *  - badgeColor: string
 *  - style: object
 */

const Avatar = ({
  uri = null,
  name = '',
  size = 48,
  onPress,
  showBadge = false,
  badgeColor = '#22C55E',
  style,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const fontSize = size * 0.36;
  const badgeSize = size * 0.28;

  const content = (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <View style={[styles.initialsBox, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={[styles.initials, { fontSize }]}>{initials || '?'}</Text>
        </View>
      )}

      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: badgeColor,
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
    position: 'relative',
  },
  initialsBox: {
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default Avatar;