import express from "express";
import { createPlans, getPlans } from "../controllers/planController.js";

const router = express.Router();

router.get('/all', getPlans);
//////router.post('/createplan', createPlans);

export default router;