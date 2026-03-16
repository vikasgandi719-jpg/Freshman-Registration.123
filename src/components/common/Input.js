import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Input
 * Props:
 *  - label: string
 *  - value: string
 *  - onChangeText: (text) => void
 *  - placeholder: string
 *  - error: string | null
 *  - hint: string | null
 *  - icon: string (emoji)
 *  - rightIcon: string (emoji)
 *  - onRightIconPress: () => void
 *  - multiline: boolean
 *  - numberOfLines: number
 *  - disabled: boolean
 *  - required: boolean
 *  - style: object
 *  - ...rest: any TextInput props
 */

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error = null,
  hint = null,
  icon = null,
  rightIcon = null,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  required = false,
  style,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {/* Label */}
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}> *</Text>}
        </View>
      )}

      {/* Input box */}
      <View
        style={[
          styles.box,
          focused && styles.boxFocused,
          error  && styles.boxError,
          disabled && styles.boxDisabled,
          multiline && styles.boxMultiline,
        ]}
      >
        {icon && <Text style={styles.leftIcon}>{icon}</Text>}

        <TextInput
          style={[
            styles.input,
            multiline && { height: numberOfLines * 24, textAlignVertical: 'top' },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={!disabled}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconBtn} disabled={!onRightIconPress}>
            <Text style={styles.rightIcon}>{rightIcon}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error / hint */}
      {error  && <Text style={styles.errorText}>⚠ {error}</Text>}
      {!error && hint && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151' },
  required: { fontSize: 13, color: '#EF4444', fontWeight: '700' },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  boxFocused:   { borderColor: '#1D4ED8', backgroundColor: '#FFFFFF' },
  boxError:     { borderColor: '#EF4444', backgroundColor: '#FFFBFB' },
  boxDisabled:  { backgroundColor: '#F1F5F9', opacity: 0.6 },
  boxMultiline: { alignItems: 'flex-start', paddingVertical: 12 },
  leftIcon:     { fontSize: 18, marginRight: 10 },
  input:        { flex: 1, fontSize: 14, color: '#1E293B', paddingVertical: 12 },
  rightIconBtn: { padding: 4 },
  rightIcon:    { fontSize: 18 },
  errorText:    { fontSize: 12, color: '#EF4444', marginTop: 5 },
  hintText:     { fontSize: 12, color: '#94A3B8', marginTop: 5 },
});

export default Input;