import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../lib/multer';
import { createProductSchema, updateProductSchema } from '@kwwi/shared';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (admin only)
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  validate(createProductSchema),
  createProduct
);
router.patch(
  '/:id',
  authMiddleware,
  validate(updateProductSchema),
  updateProduct
);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;