import express from "express";
import upload from "../middleware/upload.js";
import chartOfAccount from "../controller/charOfAccount.js";

const router = express.Router();

router.post("/charofaccount", upload.single("sheet"), chartOfAccount.createChartOfAccount);
router.delete("/charofaccount/:resourceId", chartOfAccount.deleteChartOfAccount);
router.get("/charofaccount", chartOfAccount.getChartOfAccounts);

export default router;