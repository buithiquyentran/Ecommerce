import crypto from "crypto";
import ApiKeyModel from "../models/apikey.model.js";
const findById = async (key) => {
//   const newKey = await ApiKeyModel.create({
//     key: crypto.randomBytes(16).toString("hex"),
//     status: true,
//     permissions: ["000"],
//   });
//   console.log(newKey);
  const object = await ApiKeyModel.findOne({ key, status: true }).lean();
  return object;
};
export { findById };
