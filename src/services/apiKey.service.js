import crypto from "crypto";
import ApiKeyModel from "../models/apikey.model.js";
const findById = async (key) => {
  const object = await ApiKeyModel.findOne({ key, status: true }).lean();
  return object;
};
export { findById };
