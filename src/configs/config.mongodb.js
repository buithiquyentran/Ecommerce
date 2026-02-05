import dotenv from "dotenv";
dotenv.config();
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    port: process.env.DEV_DB_PORT || 27017,
    host: process.env.DEV_DB_HOST || "localhost",
    name: process.env.DEV_DB_NAME || "DevEcommerce",
  },
};
const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3002,
  },
  db: {
    port: process.env.PRO_DB_PORT || 27017,
    host: process.env.PRO_DB_HOST || "localhost",
    name: process.env.PRO_DB_NAME || "ProEcommerce",
  },
};
const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
console.log(`You are running ${env} environment`);
export default config[env];
