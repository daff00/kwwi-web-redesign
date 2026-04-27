import { Router } from 'express';
import { submitContact } from '../controllers/contact.controller';
import { validate } from '../middleware/validate.middleware';
import { contactSchema } from '@kwwi/shared';

const router = Router();

router.post('/', validate(contactSchema), submitContact);

export default router;