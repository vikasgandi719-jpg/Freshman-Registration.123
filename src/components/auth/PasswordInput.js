import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * PasswordInput
 * Props:
 *  - label: string
 *  - value: string
 *  - onChangeText: (text: string) => void
 *  - placeholder: string
 *  - error: string | null
 *  - showStrength: boolean
 *  - onSubmitEditing: () => void
 *  - returnKeyType: string
 */

const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '#E2E8F0' };
  let score = 0;
  if (password.length >= 8)              score++;
  if (/[A-Z]/.test(password))           score++;
  if (/[0-9]/.test(password))           score++;
  if (/[^A-Za-z0-9]/.test(password))    score++;
  if (password.length >= 12)            score++;

  const levels = [
    { label: '',          color: '#E2E8F0' },
    { label: 'Very Weak', color: '#EF4444' },
    { label: 'Weak',      color: '#F97316' },
    { label: 'Fair',      color: '#EAB308' },
    { label: 'Strong',    color: '#22C55E' },
    { label: 'Very Strong', color: '#15803D' },
  ];
  return { score, ...levels[score] };
};

const REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',  test: (p) => /[A-Z]/.test(p) },
  { label: 'One number',            test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const PasswordInput = ({
  label = 'Password',
  value = '',
  onChangeText,
  placeholder = 'Enter password',
  error = null,
  showStrength = false,
  onSubmitEditing,
  returnKeyType = 'done',
}) => {
  const [visible, setVisible]  = useState(false);
  const [focused, setFocused]  = useState(false);

  const strength = showStrength ? getStrength(value) : null;
  const hasValue = value.length > 0;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[
        styles.inputBox,
        focused && styles.inputBoxFocused,
        error  && styles.inputBoxError,
      ]}>
        <Text style={styles.lockIcon}>🔒</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={!visible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {hasValue && (
          <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eyeBtn}>
            <Text style={styles.eyeIcon}>{visible ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error */}
      {error && <Text style={styles.errorText}>⚠ {error}</Text>}

      {/* Strength meter */}
      {showStrength && hasValue && (
        <View style={styles.strengthSection}>
          {/* Bars */}
          <View style={styles.barsRow}>
            {[1, 2, 3, 4, 5].map((bar) => (
              <View
                key={bar}
                style={[
                  styles.bar,
                  { backgroundColor: bar <= strength.score ? strength.color : '#E2E8F0' },
                ]}
              />
            ))}
            <Text style={[styles.strengthLabel, { color: strength.color }]}>
              {strength.label}
            </Text>
          </View>

          {/* Requirements checklist */}
          <View style={styles.requirements}>
            {REQUIREMENTS.map((req) => {
              const met = req.test(value);
              return (
                <View key={req.label} style={styles.reqRow}>
                  <Text style={[styles.reqIcon, { color: met ? '#22C55E' : '#CBD5E1' }]}>
                    {met ? '✓' : '○'}
                  </Text>
                  <Text style={[styles.reqText, met && styles.reqTextMet]}>
                    {req.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 2,
    minHeight: 50,
  },
  inputBoxFocused: { borderColor: '#1D4ED8', backgroundColor: '#FFFFFF' },
  inputBoxError:   { borderColor: '#EF4444' },
  lockIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: '#1E293B', paddingVertical: 12 },
  eyeBtn: { padding: 6 },
  eyeIcon: { fontSize: 18 },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 5 },
  strengthSection: { marginTop: 10 },
  barsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  bar: { flex: 1, height: 4, borderRadius: 4 },
  strengthLabel: { fontSize: 12, fontWeight: '700', marginLeft: 6, minWidth: 70 },
  requirements: { gap: 4 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reqIcon: { fontSize: 13, fontWeight: '700', width: 16 },
  reqText: { fontSize: 12, color: '#94A3B8' },
  reqTextMet: { color: '#22C55E' },
});

export default PasswordInput;