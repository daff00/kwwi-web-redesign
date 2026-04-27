import { Router } from 'express';
import { login, logout, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { loginSchema } from '@kwwi/shared';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);

export default router;