import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';

const BranchSelector = ({
  branches = [],
  selectedBranch = null,
  onSelect,
  placeholder = 'Select Branch',
  label = 'Branch',
}) => {
  const [visible, setVisible] = useState(false);

  const selected = branches.find((b) => b.id === selectedBranch || b.value === selectedBranch);

  const handleSelect = (branch) => {
    onSelect && onSelect(branch);
    setVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={[styles.selector, visible && styles.selectorOpen]}
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.selectorLeft}>
          <Text style={styles.selectorIcon}>🏫</Text>
          <Text style={[styles.selectorText, !selected && styles.placeholderText]}>
            {selected ? selected.label || selected.name : placeholder}
          </Text>
        </View>
        <Text style={styles.chevron}>{visible ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select Branch</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* All option */}
            <TouchableOpacity
              style={[styles.option, !selectedBranch && styles.optionActive]}
              onPress={() => handleSelect(null)}
            >
              <Text style={styles.optionIcon}>🌐</Text>
              <Text style={[styles.optionText, !selectedBranch && styles.optionTextActive]}>All Branches</Text>
              {!selectedBranch && <Text style={styles.checkMark}>✓</Text>}
            </TouchableOpacity>

            <FlatList
              data={branches}
              keyExtractor={(item) => String(item.id || item.value)}
              renderItem={({ item }) => {
                const isSelected = selected?.id === item.id || selected?.value === item.value;
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.optionActive]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.optionIcon}>🏫</Text>
                    <View style={styles.optionInfo}>
                      <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                        {item.label || item.name}
                      </Text>
                      {item.studentCount !== undefined && (
                        <Text style={styles.optionSubText}>{item.studentCount} students</Text>
                      )}
                    </View>
                    {isSelected && <Text style={styles.checkMark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectorOpen: { borderColor: '#1D4ED8' },
  selectorLeft: { flexDirection: 'row', alignItems: 'center' },
  selectorIcon: { fontSize: 18, marginRight: 10 },
  selectorText: { fontSize: 14, color: '#1E293B', fontWeight: '500' },
  placeholderText: { color: '#94A3B8' },
  chevron: { fontSize: 11, color: '#64748B' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', paddingHorizontal: 24 },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    maxHeight: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  closeBtn: { fontSize: 16, color: '#94A3B8', padding: 4 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  optionActive: { backgroundColor: '#EFF6FF' },
  optionIcon: { fontSize: 18, marginRight: 12 },
  optionInfo: { flex: 1 },
  optionText: { fontSize: 14, color: '#334155', fontWeight: '500' },
  optionTextActive: { color: '#1D4ED8', fontWeight: '700' },
  optionSubText: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  checkMark: { fontSize: 16, color: '#1D4ED8', fontWeight: '700' },
});

export default BranchSelector;