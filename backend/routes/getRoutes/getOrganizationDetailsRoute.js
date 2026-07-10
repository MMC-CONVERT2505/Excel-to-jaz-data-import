import express from "express";
import getOrganizationDetails from "../../controller/getController/getOrganizationDetails.js";


const router = express.Router();

router.get("/organization", getOrganizationDetails);

export default router;