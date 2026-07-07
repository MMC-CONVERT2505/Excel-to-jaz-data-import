import express from "express";
import upload from "../middleware/upload.js"
import invoicePayment from "../controller/invoicePayment.js"

const router = express.Router();

router.post("/invoice-payment", upload.single("sheet"), invoicePayment.createInvoicePayment);


export default router;