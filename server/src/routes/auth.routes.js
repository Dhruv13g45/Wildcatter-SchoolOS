import { Router } from 'express';
import { register, login, googleAuth, getMe, getAllUsers } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { registerSchema, loginSchema, googleAuthSchema } from '../validations/schemas.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleAuthSchema), googleAuth);
router.get('/me', authenticateToken, getMe);
router.get('/users', getAllUsers);

export default router;
