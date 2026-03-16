import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import DocumentCard from './DocumentCard';

const FILTERS = ['All', 'Pending', 'Approved', 'Rejected', 'Not Uploaded'];
const FILTER_MAP = {
  All: null, Pending: 'pending', Approved: 'approved',
  Rejected: 'rejected', 'Not Uploaded': 'not_uploaded',
};

const DocumentStatusList = ({ documents = [], onDocumentPress, onUploadPress, showFilter = true }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredDocs = FILTER_MAP[activeFilter]
    ? documents.filter((d) => d.status === FILTER_MAP[activeFilter])
    : documents;

  const counts = {
    total:    documents.length,
    approved: documents.filter((d) => d.status === 'approved').length,
    pending:  documents.filter((d) => d.status === 'pending').length,
    rejected: documents.filter((d) => d.status === 'rejected').length,
  };

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summaryRow}>
        {[
          { label: 'Total',    value: counts.total,    color: '#1D4ED8' },
          { label: 'Approved', value: counts.approved, color: '#15803D' },
          { label: 'Pending',  value: counts.pending,  color: '#C2410C' },
          { label: 'Rejected', value: counts.rejected, color: '#BE123C' },
        ].map((item) => (
          <View key={item.label} style={[styles.summaryChip, { borderColor: item.color }]}>
            <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.summaryLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Filters */}
      {showFilter && (
        <View style={styles.filterWrapper}>
          <FlatList
            horizontal
            data={FILTERS}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.filterChip, activeFilter === item && styles.filterChipActive]}
                onPress={() => setActiveFilter(item)}
              >
                <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredDocs}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <DocumentCard
            document={item}
            onPress={() => onDocumentPress && onDocumentPress(item)}
            onUpload={() => onUploadPress && onUploadPress(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyTitle}>No Documents Found</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'All' ? 'No documents assigned yet.' : `No "${activeFilter}" documents.`}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  summaryChip: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, minWidth: 72 },
  summaryValue: { fontSize: 20, fontWeight: '700' },
  summaryLabel: { fontSize: 10, color: '#64748B', marginTop: 2, fontWeight: '500' },
  filterWrapper: { backgroundColor: '#FFFFFF', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 8 },
  filterChipActive: { backgroundColor: '#1D4ED8' },
  filterText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
});

export default DocumentStatusList;