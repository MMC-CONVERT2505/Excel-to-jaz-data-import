import express from "express";
import upload from "../middleware/upload.js"
import customer from "../controller/customer.js"

const router = express.Router();

router.post("/customer", upload.single("sheet"), customer.createCustomer);
router.get("/customer", customer.getCustomer);
router.delete("/customer/:customerId", customer.deleteCustomer);

export default router;