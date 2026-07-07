import express from "express";
import upload from "../middleware/upload.js"
import supplire from "../controller/supplire.js"

const router = express.Router();

router.post("/supplire", upload.single("sheet"), supplire.createSupplier);
router.get("/supplire", supplire.getSuppliers);
router.delete("/supplire/:supplireId", supplire.deleteSupplire);

export default router;