import React, { createContext, useContext, useReducer } from 'react';

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  profile:    null,
  documents:  [],
  isLoading:  false,
  error:      null,

  // Upload states per document id
  uploadProgress: {},   // { [docId]: 0-100 }
  uploadStatus:   {},   // { [docId]: 'idle' | 'uploading' | 'done' | 'error' }
};

// ─── Action Types ──────────────────────────────────────────────────────────────
const STUDENT_ACTIONS = {
  SET_LOADING:       'SET_LOADING',
  SET_ERROR:         'SET_ERROR',
  CLEAR_ERROR:       'CLEAR_ERROR',
  SET_PROFILE:       'SET_PROFILE',
  UPDATE_PROFILE:    'UPDATE_PROFILE',
  SET_DOCUMENTS:     'SET_DOCUMENTS',
  UPDATE_DOCUMENT:   'UPDATE_DOCUMENT',
  SET_UPLOAD_PROGRESS: 'SET_UPLOAD_PROGRESS',
  SET_UPLOAD_STATUS:   'SET_UPLOAD_STATUS',
  RESET:             'RESET',
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
const studentReducer = (state, action) => {
  switch (action.type) {
    case STUDENT_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case STUDENT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case STUDENT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case STUDENT_ACTIONS.SET_PROFILE:
      return { ...state, profile: action.payload, isLoading: false };

    case STUDENT_ACTIONS.UPDATE_PROFILE:
      return { ...state, profile: { ...state.profile, ...action.payload } };

    case STUDENT_ACTIONS.SET_DOCUMENTS:
      return { ...state, documents: action.payload, isLoading: false };

    case STUDENT_ACTIONS.UPDATE_DOCUMENT: {
      const updated = state.documents.map((doc) =>
        doc.id === action.payload.id ? { ...doc, ...action.payload } : doc
      );
      return { ...state, documents: updated };
    }

    case STUDENT_ACTIONS.SET_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: {
          ...state.uploadProgress,
          [action.payload.docId]: action.payload.progress,
        },
      };

    case STUDENT_ACTIONS.SET_UPLOAD_STATUS:
      return {
        ...state,
        uploadStatus: {
          ...state.uploadStatus,
          [action.payload.docId]: action.payload.status,
        },
      };

    case STUDENT_ACTIONS.RESET:
      return { ...initialState };

    default:
      return state;
  }
};

// ─── Context ───────────────────────────────────────────────────────────────────
const StudentContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export const StudentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(studentReducer, initialState);

  const setProfile    = (data)   => dispatch({ type: STUDENT_ACTIONS.SET_PROFILE,    payload: data   });
  const updateProfile = (data)   => dispatch({ type: STUDENT_ACTIONS.UPDATE_PROFILE, payload: data   });
  const setDocuments  = (docs)   => dispatch({ type: STUDENT_ACTIONS.SET_DOCUMENTS,  payload: docs   });
  const setLoading    = (val)    => dispatch({ type: STUDENT_ACTIONS.SET_LOADING,    payload: val    });
  const setError      = (msg)    => dispatch({ type: STUDENT_ACTIONS.SET_ERROR,      payload: msg    });
  const clearError    = ()       => dispatch({ type: STUDENT_ACTIONS.CLEAR_ERROR                      });
  const resetStudent  = ()       => dispatch({ type: STUDENT_ACTIONS.RESET                            });

  const updateDocument = (docData) =>
    dispatch({ type: STUDENT_ACTIONS.UPDATE_DOCUMENT, payload: docData });

  const setUploadProgress = (docId, progress) =>
    dispatch({ type: STUDENT_ACTIONS.SET_UPLOAD_PROGRESS, payload: { docId, progress } });

  const setUploadStatus = (docId, status) =>
    dispatch({ type: STUDENT_ACTIONS.SET_UPLOAD_STATUS, payload: { docId, status } });

  // ─── Computed ──────────────────────────────────────────────────────────────
  const documentStats = {
    total:       state.documents.length,
    approved:    state.documents.filter((d) => d.status === 'approved').length,
    pending:     state.documents.filter((d) => d.status === 'pending').length,
    rejected:    state.documents.filter((d) => d.status === 'rejected').length,
    notUploaded: state.documents.filter((d) => d.status === 'not_uploaded').length,
  };

  const isVerified =
    state.profile?.verificationStatus === 'approved';

  const pendingDocuments =
    state.documents.filter((d) => d.status === 'not_uploaded' || d.status === 'rejected');

  return (
    <StudentContext.Provider
      value={{
        ...state,
        setProfile,
        updateProfile,
        setDocuments,
        updateDocument,
        setUploadProgress,
        setUploadStatus,
        setLoading,
        setError,
        clearError,
        resetStudent,
        documentStats,
        isVerified,
        pendingDocuments,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error('useStudent must be used within StudentProvider');
  return context;
};

export default StudentContext;