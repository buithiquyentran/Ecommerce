import express from "express";
import  accessRouter  from "./access/index.js";
import  productRouter  from "./product/index.js";
const router = express.Router();
import {apiKey, permission} from "../auth/checkAuth.js";



// access router
router.use("/v1/api/shop", accessRouter);

// check permission
// router.use(permission("000"));

// check api v1
router.use(apiKey)

// product router
router.use("/v1/api/products", productRouter);

export { router };
