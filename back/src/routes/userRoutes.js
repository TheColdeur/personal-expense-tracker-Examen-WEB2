import express from "express";
import { authentication } from "../middlewares/authentication.js";
import {
    getUserProfile,
    updateUserProfile,
    changePassword,
    toggleDarkMode,
    deleteUserAccount
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authentication, getUserProfile);

router.put("/profile", authentication, updateUserProfile);

router.put("/change-password", authentication, changePassword);

router.put("/dark-mode", authentication, toggleDarkMode);

router.delete("/account", authentication, deleteUserAccount);

export default router;