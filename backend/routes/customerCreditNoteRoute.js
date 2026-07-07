import express from "express";
import upload from "../middleware/upload.js"
import customerCreditNote from "../controller/customerCreditNote.js"

const router = express.Router();
router.post("/customer-credit-note", upload.single("sheet"), customerCreditNote.createCustomerCreditNote);


export default router;