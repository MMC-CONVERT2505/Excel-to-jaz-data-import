import express from "express";
import upload from "../middleware/upload.js"
import taxProfile from "../controller/taxProfile.js"

const router = express.Router();

router.post("/taxProfile", upload.single("sheet"), taxProfile.createTaxProfile);
router.get("/taxProfile", taxProfile.getTaxProfiles);


export default router;