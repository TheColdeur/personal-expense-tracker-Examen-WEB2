import express from "express";
import { login, logout, signup, userInfo } from "../controllers/authController.js";
import { authentication } from "../middlewares/authentication.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authentication, userInfo);
router.get('/logout', authentication, logout);

export default router;