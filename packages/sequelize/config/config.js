require("dotenv").config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
  },
  test: {
    url: process.env.DATABASE_URL_TEST,
    dialect: "postgres",
  },
  production: {
    url: process.env.DATABASE_URL_PROD,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
