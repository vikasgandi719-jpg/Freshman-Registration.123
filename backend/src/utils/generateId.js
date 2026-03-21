// Generates a unique student ID like: 2026-BVRITN-1A-0001
const generateStudentId = (counter, branchCode = '1A') => {
  const year   = new Date().getFullYear();
  const padded = String(counter).padStart(4, '0');
  return `${year}-BVRITN-${branchCode}-${padded}`;
};

module.exports = { generateStudentId };

