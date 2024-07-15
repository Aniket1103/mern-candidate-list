import express from 'express';
import candidate from './routes/candidate.js'
import { config } from 'dotenv';
import cors from 'cors';

config({
  path: "./config/config.env"
})

export const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1', candidate);