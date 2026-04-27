import { Router } from 'express';
import contactRoutes from './contact.routes';
import productRoutes from './product.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/contact', contactRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);

export default router;