import express from 'express';
import { updateBatch, deleteBatch, addCandidate, getCandidates, sendMail, downloadCsv } from '../controllers/candidateController.js';

const router = express.Router();

router.get('/getCandidates', getCandidates);

router.patch('/update', updateBatch);

router.delete('/delete', deleteBatch);

router.post('/addCandidate', addCandidate);

router.post('/sendMail', sendMail);

router.post('/downloadCsv', downloadCsv);

export default router;
