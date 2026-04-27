import { User } from '@kwwi/shared';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'email'>;
    }
  }
}