module.exports = {
  // PostgreSQL configuration
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || "freshman_registration",
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_SSL: process.env.DB_SSL === "true",
};
