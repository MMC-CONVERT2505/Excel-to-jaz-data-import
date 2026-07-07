import express from "express";
import upload from "../middleware/upload.js"
import billPayment from "../controller/billPayment.js"

const router = express.Router();

router.post("/bill-payment", upload.single("sheet"), billPayment.createBillPayment);


export default router;