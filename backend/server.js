require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const { errorHandler }  = require('./src/middleware/errorHandler');
const authRoutes        = require('./src/routes/authRoutes');
const studentRoutes     = require('./src/routes/studentRoutes');
const adminRoutes       = require('./src/routes/adminRoutes');
const documentRoutes    = require('./src/routes/documentRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/student',   studentRoutes);   // matches /student/profile etc.
app.use('/api/admin',     adminRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => res.json({ message: 'BVRITN API is running ✓' }));

// ─── Error Handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

