import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import routes from './routes';

const app = express();

// ─── Security middleware ────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.clientUrl,
  credentials: true,
}));

// ─── Rate limiting ──────────────────────────────────────
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later' },
}));

// ─── General middleware ─────────────────────────────────
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ─────────────────────────────────────────────
app.use('/api', routes);

// ─── Health check ───────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: env.nodeEnv });
});

// ─── Error handler (must be last) ───────────────────────
app.use(errorMiddleware);

// ─── Start server ───────────────────────────────────────
app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});

export default app;