const router = require('express').Router();
const auth   = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProfile, updateProfile, uploadPhoto,
  getVerificationStatus, getDocumentSummary,
} = require('../controllers/studentController');

router.use(auth); // all student routes require auth

router.get('/profile',              getProfile);
router.put('/update',               updateProfile);
router.post('/photo',               upload.single('photo'), uploadPhoto);
router.get('/verification-status',  getVerificationStatus);
router.get('/document-summary',     getDocumentSummary);

module.exports = router;
