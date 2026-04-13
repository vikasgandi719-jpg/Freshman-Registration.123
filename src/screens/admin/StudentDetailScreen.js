import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, ActivityIndicator, TouchableOpacity,
  Alert, Linking, Platform, Modal, Image,
} from 'react-native';
import Header              from '../../components/common/Header';
import ProfileCard         from '../../components/student/ProfileCard';
import DocumentStatusList  from '../../components/student/DocumentStatusList';
import VerificationControls from '../../components/admin/VerificationControls';
import { useStudents }     from '../../hooks/useStudents';

const StudentDetailScreen = ({ navigation, route }) => {
  const { studentId, student: passedStudent } = route.params || {};
  const { fetchStudentById, verifyStudent, rejectStudent,
          resetStudentStatus, selectedStudent, isLoading, actionLoading } = useStudents();

  const [tab, setTab] = useState('profile'); // 'profile' | 'documents'
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');
  const [viewerIsImage, setViewerIsImage] = useState(false);
  const [viewerZoom, setViewerZoom] = useState(1);

  const isImageFile = (url, type = '') =>
    /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url || '') ||
    String(type).toLowerCase().includes('image');

  useEffect(() => {
    if (studentId) fetchStudentById(studentId);
  }, [studentId]);

  const student = selectedStudent || passedStudent;

  const handleDocumentPress = async (doc) => {
    const fileSource = doc?.fileUrl || doc?.file_url || doc?.fileUri || doc?.file_uri;
    const fileType = doc?.fileType || doc?.file_type || doc?.mimeType || doc?.mime_type || '';

    if (!fileSource) {
      Alert.alert('No File', 'No uploaded file is available for this document.');
      return;
    }

    try {
      if (Platform.OS === 'web') {
        setViewerUrl(fileSource);
        setViewerIsImage(isImageFile(fileSource, fileType));
        setViewerZoom(1);
        setViewerVisible(true);
        return;
      }

      const supported = await Linking.canOpenURL(fileSource);
      if (!supported) {
        Alert.alert('Cannot Open File', 'This file cannot be opened on this device.');
        return;
      }

      await Linking.openURL(fileSource);
    } catch (err) {
      Alert.alert('Open Failed', err?.message || 'Unable to open this document.');
    }
  };

  if (isLoading && !student) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Student Detail" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1D4ED8" />
        </View>
      </SafeAreaView>
    );
  }

  if (!student) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Student Detail" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Student not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title={student.name || 'Student Detail'}
        subtitle={student.rollNumber}
        onBack={() => navigation.goBack()}
      />

      {/* Tab toggle */}
      <View style={styles.tabRow}>
        {['profile', 'documents'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'profile' ? '👤  Profile' : '📄  Documents'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === 'profile' ? (
          <>
            <ProfileCard student={student} />
            <VerificationControls
              student={student}
              currentStatus={student.verificationStatus}
              loading={actionLoading}
              onApprove={(s)       => verifyStudent(s.id)}
              onReject={(s, reason)=> rejectStudent(s.id, reason)}
              onReset={(s)         => resetStudentStatus(s.id)}
            />
          </>
        ) : (
          <DocumentStatusList
            documents={student.documents || []}
            showFilter
            onDocumentPress={handleDocumentPress}
          />
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal
        visible={viewerVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setViewerVisible(false)}
      >
        <View style={styles.viewerOverlay}>
          <View style={styles.viewerCard}>
            <View style={styles.viewerHeader}>
              <Text style={styles.viewerTitle}>Document Preview</Text>
              <TouchableOpacity
                style={styles.viewerCloseBtn}
                onPress={() => setViewerVisible(false)}
              >
                <Text style={styles.viewerCloseText}>Close</Text>
              </TouchableOpacity>
            </View>

            {Platform.OS === 'web' ? (
              viewerIsImage ? (
                <View style={styles.viewerBody}>
                  <View style={styles.zoomRow}>
                    <TouchableOpacity
                      style={styles.zoomBtn}
                      onPress={() => setViewerZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                    >
                      <Text style={styles.zoomBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.zoomLabel}>{Math.round(viewerZoom * 100)}%</Text>
                    <TouchableOpacity
                      style={styles.zoomBtn}
                      onPress={() => setViewerZoom((z) => Math.min(4, +(z + 0.25).toFixed(2)))}
                    >
                      <Text style={styles.zoomBtnText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.zoomResetBtn}
                      onPress={() => setViewerZoom(1)}
                    >
                      <Text style={styles.zoomResetText}>Reset</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    contentContainerStyle={styles.zoomImageWrap}
                    maximumZoomScale={4}
                    minimumZoomScale={0.5}
                  >
                    <Image
                      source={{ uri: viewerUrl }}
                      style={[
                        styles.zoomImage,
                        { transform: [{ scale: viewerZoom }] },
                      ]}
                      resizeMode="contain"
                    />
                  </ScrollView>
                </View>
              ) : React.createElement('iframe', {
                src: viewerUrl,
                style: styles.viewerFrame,
                title: 'Document Preview',
              })
            ) : (
              <View style={styles.viewerFallback}>
                <Text style={styles.viewerFallbackText}>
                  In-app preview is enabled for web. On mobile, document opens using device viewer.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText:{ fontSize: 15, color: '#94A3B8' },
  tabRow: {
    flexDirection:    'row',
    marginHorizontal: 16,
    marginVertical:   12,
    backgroundColor:  '#F1F5F9',
    borderRadius:     10,
    padding:          4,
  },
  tab: {
    flex:            1,
    paddingVertical: 10,
    borderRadius:    8,
    alignItems:      'center',
  },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText:       { fontSize: 13, color: '#64748B', fontWeight: '600' },
  tabTextActive: { color: '#1D4ED8', fontWeight: '700' },
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  viewerCard: {
    width: '100%',
    maxWidth: 1100,
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  viewerHeader: {
    height: 52,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewerTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  viewerCloseBtn: {
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  viewerCloseText: { color: '#0F172A', fontWeight: '600', fontSize: 12 },
  viewerFrame: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  viewerBody: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  zoomRow: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  zoomBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
  },
  zoomLabel: {
    minWidth: 48,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  zoomResetBtn: {
    marginLeft: 'auto',
    backgroundColor: '#1D4ED8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  zoomResetText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  zoomImageWrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  zoomImage: {
    width: 900,
    height: 900,
    maxWidth: '100%',
    maxHeight: '100%',
  },
  viewerFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  viewerFallbackText: { color: '#475569', textAlign: 'center', fontSize: 14 },
});

export default StudentDetailScreen;