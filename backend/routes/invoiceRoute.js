import express from "express";
import upload from "../middleware/upload.js"
import invoice from "../controller/invoice.js"

const router = express.Router();

router.post("/invoice", upload.single("sheet"), invoice.createInvoice);
router.get("/invoice", invoice.getInvoiceId);


export default router;