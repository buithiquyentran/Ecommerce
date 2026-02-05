import dotenv from "dotenv";
dotenv.config();
import config from "./src/configs/config.mongodb.js";
import app from "./src/app.js";
const PORT = config.app.port || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
