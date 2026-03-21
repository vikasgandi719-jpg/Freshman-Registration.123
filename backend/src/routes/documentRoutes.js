const router    = require('express').Router();
const auth      = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const upload    = require('../middleware/upload');
const {
  getDocuments, getDocumentById,
  uploadDocument, deleteDocument, getDocumentStatus,
} = require('../controllers/documentController');

// Student routes
router.get('/',                  auth, getDocuments);
router.get('/status/:id',        auth, getDocumentStatus);
router.get('/:id',               auth, getDocumentById);
router.post('/upload/:documentType', auth, upload.single('file'), uploadDocument);
router.delete('/:id',            auth, deleteDocument);

module.exports = router;
