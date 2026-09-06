import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from './config/passport';
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/auth', require('./routes/auth').default);
app.use('/households', require('./routes/households').default);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'hogaru-backend' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hogaru API running on port ${PORT}`));