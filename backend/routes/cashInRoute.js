import express from "express";
import upload from "../middleware/upload.js"
import createCashIn from "../controller/cashIn.js";

const router = express.Router();

router.post("/cashIn", upload.single("sheet"), createCashIn.createCashIn);

export default router;