import express from "express";
import upload from "../middleware/upload.js"
import item from "../controller/item.js"

const router = express.Router();

router.post("/item", upload.single("sheet"), item.createItem);


export default router;