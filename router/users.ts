import express from 'express';
import { UsersController } from '../controllers';

const router = express.Router();

const userController = new UsersController();


router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

export const userRouter = router;