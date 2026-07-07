import express from "express";
import upload from "../middleware/upload.js"
import createCashOut from "../controller/cashOut.js";

const router = express.Router();

router.post("/cashout", upload.single("sheet"), createCashOut.createCashOut);
router.delete("/cashout", createCashOut.deleteCashOut);

export default router;