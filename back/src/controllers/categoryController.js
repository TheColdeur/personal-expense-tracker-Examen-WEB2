import { pool } from "../config/db.js";

export const getCategories = async (req, res) => {
    try {
        const userId = req.user;

        const categories = await pool.query("SELECT name FROM user_category uc JOIN categories c ON uc.categoryId = c.id WHERE uc.userId = $1", [userId]);

        res.json({ category: categories.rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const createCategory = async (req, res) => {
    try {
        const userId = req.user;
        const { name } = req.body;

        const newCategory = await pool.query("INSERT INTO categories (name) VALUES ($1) RETURNING *", [name]);

        await pool.query("INSERT INTO user_category (userId, categoryId) VALUES ($1, $2)", [userId, newCategory.rows[0].id]);

        res.status(201).json({ message: "Category created successfully",
            category: newCategory.rows
        });
    } catch (err) {
        if(err.code == "23505"){
            return res.status(401).json({ message: "Category already exist" });
        }
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const updateCategory = async (req, res) => {
    try {
        const userId = req.user;
        const categoryId = req.params.id;
        const { name } = req.body;

        if (!name || name == null){
            return res.status(400).json({ message: "Category name required" });
        }
        
        const userCategories = (await pool.query("SELECT c.id FROM categories c JOIN user_category uc ON uc.categoryId = c.id WHERE uc.userId = $1 AND c.is_default = false AND c.id = $2", [userId, categoryId])).rows;

        if(userCategories.length == 0){
            return res.status(404).json({ message: "Category not found or permission denied" });
        }
        
        const updatedCategory = await pool.query("UPDATE categories SET name = $1 WHERE id = $2 RETURNING *", [name, categoryId]);

        res.status(200).json({ message: "Category updated successfully",
            category: updatedCategory.rows[0]
        });
    } catch (err) {
        if(err.message == "Cannot destructure property 'name' of 'req.body' as it is undefined."){
            console.error(err);
            return res.status(400).json({ message: "Category name require" });
        }
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const userId = req.user;

        const category = await pool.query("SELECT c.id, c.name FROM categories c JOIN user_category uc ON uc.categoryId = c.id WHERE c.id = $1 AND uc.userId = $2", [categoryId, userId]);

        if(category.rows[0].is_default || category.rows.length == 0){
            return res.status(404).json({ message: "Category not found or permission denied" });
        }

        const isUse = await pool.query("SELECT c.id, c.name FROM categories c JOIN expenses e ON e.categoryId = c.id WHERE c.id = $1", [categoryId]);

        if(isUse.rows.length > 0){
            return res.status(401).json({ message: "Impossible to delete a category in use" });
        }

        await pool.query("DELETE FROM user_category WHERE categoryId = $1 AND userId = $2", [categoryId, userId]);

        await pool.query("DELETE FROM categories WHERE id = $1", [categoryId]);

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}