import express from "express";
import tag from "../controller/tag.js"

const router = express.Router();

router.post("/tag", tag.createTag);


export default router;