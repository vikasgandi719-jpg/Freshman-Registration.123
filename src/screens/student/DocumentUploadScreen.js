import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, RefreshControl,
} from 'react-native';
import Header             from '../../components/common/Header';
import DocumentStatusList from '../../components/student/DocumentStatusList';
import DocumentUploader   from '../../components/student/DocumentUploader';
import Modal              from '../../components/common/Modal';
import { useAuth }        from '../../context/AuthContext';
import useDocuments       from '../../hooks/useDocuments';
import { SCREENS }        from '../../constants/config';

const DocumentUploadScreen = ({ navigation }) => {
  const { user }                                           = useAuth();
  const { documents, fetchDocuments, uploadDocument,
          isLoading, uploading }                           = useDocuments();
  const [refreshing,    setRefreshing]                     = useState(false);
  const [uploadModal,   setUploadModal]                    = useState(false);
  const [selectedDoc,   setSelectedDoc]                    = useState(null);

  useEffect(() => {
    if (user?.id) fetchDocuments(user.id);
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.id) await fetchDocuments(user.id);
    setRefreshing(false);
  };

  const handleUploadPress = (doc) => {
    setSelectedDoc(doc);
    setUploadModal(true);
  };

  const handleDocumentPress = (doc) => {
    navigation.navigate(SCREENS.DOCUMENT_DETAIL, { document: doc });
  };

  const handleUploadSuccess = async (file) => {
    await uploadDocument(selectedDoc.id, file.uri, file.mimeType, file.name);
    setUploadModal(false);
    setSelectedDoc(null);
    if (user?.id) fetchDocuments(user.id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="My Documents"
        subtitle="Upload & track your documents"
        variant="default"
        showBorder
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1D4ED8']} />}
      >
        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerIcon}>ℹ️</Text>
          <Text style={styles.infoBannerText}>
            Upload all required documents in PDF or image format.
            Max file size is 5MB per document.
          </Text>
        </View>

        {/* Document list */}
        <DocumentStatusList
          documents={documents}
          onDocumentPress={handleDocumentPress}
          onUploadPress={handleUploadPress}
          showFilter
        />

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Upload Modal */}
      <Modal
        visible={uploadModal}
        onClose={() => { setUploadModal(false); setSelectedDoc(null); }}
        title={selectedDoc?.title || 'Upload Document'}
        subtitle="Select a file from your device"
        icon="📤"
        size="md"
      >
        {selectedDoc && (
          <DocumentUploader
            documentTitle={selectedDoc.title}
            documentId={selectedDoc.id}
            existingFileUri={selectedDoc.fileUri}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={() => {}}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#F8FAFC' },
  infoBanner: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    backgroundColor:   '#EFF6FF',
    marginHorizontal:  16,
    marginTop:         12,
    marginBottom:      4,
    padding:           12,
    borderRadius:      10,
    gap:               10,
    borderWidth:       1,
    borderColor:       '#BFDBFE',
  },
  infoBannerIcon: { fontSize: 16, marginTop: 1 },
  infoBannerText: { flex: 1, fontSize: 12, color: '#1E40AF', lineHeight: 18 },
});

export default DocumentUploadScreen;