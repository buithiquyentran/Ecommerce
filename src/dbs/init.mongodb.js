import mongoose from "mongoose";
import countConnect from "../helpers/check.connect.js";
import config from "../configs/config.mongodb.js";
const { host, port, name } = config.db;
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    if (1 == 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then((_) => {
        console.log(`Connected to MongoDB ${name}`);
        countConnect();
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongo = Database.getInstance();
export default instanceMongo;
