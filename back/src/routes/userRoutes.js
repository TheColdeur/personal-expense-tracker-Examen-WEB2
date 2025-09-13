import express from "express";
import {
    getUserProfile,
    updateUserProfile,
    changePassword,
    deleteUserAccount
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", getUserProfile);

router.put("/profile", updateUserProfile);

router.put("/change-password", changePassword);

router.delete("/account", deleteUserAccount);

export default router;