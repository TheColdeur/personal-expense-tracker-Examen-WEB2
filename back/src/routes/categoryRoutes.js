import express from "express";
import { authentication } from "../middlewares/authentication.js";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/",authentication, getCategories);
router.post("/", authentication, createCategory);
router.put("/:id", authentication, updateCategory);
router.delete("/:id", authentication, deleteCategory);

export default router;