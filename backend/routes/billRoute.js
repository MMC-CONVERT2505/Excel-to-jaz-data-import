import express from "express";
import upload from "../middleware/upload.js"
import bill from "../controller/bills.js"

const router = express.Router();

router.post("/bill", upload.single("sheet"), bill.createBill);
router.get("/bill", bill.getBillsId);


export default router;