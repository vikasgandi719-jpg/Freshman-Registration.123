import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const STATUS_OPTIONS = [
  { label: 'All',          value: null },
  { label: 'Pending',      value: 'pending'   },
  { label: 'Approved',     value: 'approved'  },
  { label: 'Rejected',     value: 'rejected'  },
  { label: 'Incomplete',   value: 'incomplete'},
];

const SearchFilter = ({
  onSearch,
  onFilterChange,
  onClear,
  placeholder = 'Search by name, roll no, email…',
}) => {
  const [query, setQuery]           = useState('');
  const [activeStatus, setStatus]   = useState(null);

  const handleSearch = (text) => {
    setQuery(text);
    onSearch && onSearch(text);
  };

  const handleStatusFilter = (value) => {
    setStatus(value);
    onFilterChange && onFilterChange({ status: value, query });
  };

  const handleClear = () => {
    setQuery('');
    setStatus(null);
    onClear && onClear();
    onSearch && onSearch('');
    onFilterChange && onFilterChange({ status: null, query: '' });
  };

  const hasActiveFilter = query.length > 0 || activeStatus !== null;

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearInput}>
              <Text style={styles.clearInputText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {hasActiveFilter && (
          <TouchableOpacity style={styles.clearAllBtn} onPress={handleClear}>
            <Text style={styles.clearAllText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status filter chips */}
      <View style={styles.filtersRow}>
        {STATUS_OPTIONS.map((opt) => {
          const isActive = activeStatus === opt.value;
          return (
            <TouchableOpacity
              key={String(opt.value)}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => handleStatusFilter(opt.value)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active filter summary */}
      {hasActiveFilter && (
        <View style={styles.activeSummary}>
          <Text style={styles.activeSummaryText}>
            🔎 Filtering by:{' '}
            {[query && `"${query}"`, activeStatus && `Status: ${activeStatus}`]
              .filter(Boolean)
              .join('  ·  ')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: '#1E293B' },
  clearInput: { padding: 4 },
  clearInputText: { fontSize: 13, color: '#94A3B8' },
  clearAllBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
  },
  clearAllText: { fontSize: 13, color: '#DC2626', fontWeight: '600' },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: { backgroundColor: '#EFF6FF', borderColor: '#1D4ED8' },
  chipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  chipTextActive: { color: '#1D4ED8', fontWeight: '700' },
  activeSummary: {
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
  },
  activeSummaryText: { fontSize: 12, color: '#64748B' },
});

export default SearchFilter;