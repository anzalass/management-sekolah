import express from 'express';
import { generateRaport } from '../controller/raportController.js'; 

const router = express.Router();
router.get('/generate-raport/:nis', generateRaport);

export default router;
