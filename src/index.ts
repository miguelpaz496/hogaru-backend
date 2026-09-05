import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'hogaru-backend' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hogaru API running on port ${PORT}`));