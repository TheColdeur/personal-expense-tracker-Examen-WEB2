import express from "express";
import { login, logout, signup, userInfo } from "../controllers/authController.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', userInfo);
router.get('/logout', logout);

export default router;