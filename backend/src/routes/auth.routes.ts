import express from 'express';
import { body, validationResult } from 'express-validator';
import * as authCtrl from '../controllers/auth.controller';

const router = express.Router();

// helper to handle validation errors
const handleValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * POST /api/auth/signup
 */
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidation,
  ],
  authCtrl.signup
);

/**
 * POST /api/auth/login
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidation,
  ],
  authCtrl.login
);

export default router;