import express from "express";
import upload from "../middleware/upload.js"
import supplireCreditNote from "../controller/supplireCreditNote.js"

const router = express.Router();

router.post("/supplire-credit-note", upload.single("sheet"), supplireCreditNote.createSupplireCreditNote);


export default router;