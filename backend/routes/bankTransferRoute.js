import express from "express";
import upload from "../middleware/upload.js";
import bankTransefer from "../controller/bankTransfer.js";

const router = express.Router();

router.post("/banktransefer", upload.single("sheet"), bankTransefer.createBankTransefer);
// router.delete("/banktransefer/:resourceId", bankTransefer.createBankTransefer);

export default router;