const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const validateSignupPayload = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return 'Name, email, and password are required';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'Invalid email format';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  return null;
};

const signup = async ({ name, email, password, fileUrl }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    const conflictError = new Error('User already exists');
    conflictError.statusCode = 409;
    throw conflictError;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      fileUrl,
    },
    select: {
      id: true,
      name: true,
      email: true,
      fileUrl: true,
      createdAt: true,
    },
  });
};

module.exports = {
  signup,
  validateSignupPayload,
};
