import mongoose from "mongoose";
const connectString = "mongodb://localhost:27017/Ecommerce/Ecommerce";
import countConnect from "../helpers/check.connect.js";

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
        console.log("Connected to MongoDB Pro");
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
