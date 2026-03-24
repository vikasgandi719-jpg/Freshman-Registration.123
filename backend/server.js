require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const prisma = require('./src/lib/prisma');

const { errorHandler } = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/authRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const documentRoutes = require('./src/routes/documentRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Database Connection Check ────────────────────────────────────────────────
async function testDbConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful (Prisma)');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testDbConnection();

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) =>
  res.json({
    message: 'BVRITN API is running ✓',
    database: 'Connected',
  })
);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
