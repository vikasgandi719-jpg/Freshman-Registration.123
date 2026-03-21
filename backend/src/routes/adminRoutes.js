const router    = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const {
  adminLogin,
  getStudents, getStudentById,
  verifyStudent, rejectStudent, resetStudentStatus,
  getStats, getBranches, updateBranch,
  verifyDocument, rejectDocument,
  exportStudentData,
} = require('../controllers/adminController');

// Public admin login
router.post('/login', adminLogin);

// All routes below require admin token
router.use(adminAuth);

router.get('/students',                   getStudents);
router.get('/students/:id',               getStudentById);
router.patch('/students/:id/reset',       resetStudentStatus);

router.post('/verify/:studentId',         verifyStudent);
router.post('/reject/:studentId',         rejectStudent);

router.get('/stats',                      getStats);

router.get('/branches',                   getBranches);
router.put('/branches/:id',               updateBranch);

router.post('/documents/:documentId/verify', verifyDocument);
router.post('/documents/:documentId/reject', rejectDocument);

router.post('/export',                    exportStudentData);

module.exports = router;
