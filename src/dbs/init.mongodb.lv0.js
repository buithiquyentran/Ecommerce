import mongoose from "mongoose";
const connectString = "mongodb://localhost:27017/Ecommerce/Ecommerce";
mongoose
  .connect(connectString)
  .then((_) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
// dev
if (1 == 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}
export default mongoose;
