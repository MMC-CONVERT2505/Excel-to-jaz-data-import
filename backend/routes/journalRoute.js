import express from "express";
import upload from "../middleware/upload.js"
import journal from "../controller/journal.js"

const router = express.Router();

router.post("/journal", upload.single("sheet"), journal.createJournal);
// router.delete("/journal/:journalId", journal.deleteJournal);

export default router;