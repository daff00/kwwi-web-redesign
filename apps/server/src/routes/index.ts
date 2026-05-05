import { Router } from 'express';
import contactRoutes from './contact.routes';
import productRoutes from './product.routes';

const router = Router();

router.use('/contact', contactRoutes);
router.use('/products', productRoutes);

export default router;