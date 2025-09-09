require('dotenv').config();
const API_Key= process.env.API;
const express = require('express');
const axios= require('axios');
const path = require("path");
const router= express.Router();
const pool = require("../db");


// rendering recipes API 
router.get("/api", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/random",
      {
        params: {
          apiKey: API_Key,
          number: 3,
        },
      }
    );

    // Use response.data for axios
    const recipesArray = response.data.recipes || [];

    // Insert each recipe into Postgres
    for (const recipe of recipesArray) {
      await pool.query(
        `INSERT INTO recipes (title, image, instuctions, ingredients, readyin)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [
          recipe.title,
          recipe.image,
          recipe.instructions || "",
          JSON.stringify(recipe.extendedIngredients || []),
          recipe.readyInMinutes || 0,
        ]
      );
    }

    res.send("Recipes imported successfully!");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

// Fetch random HTML page
router.get("/random", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/randomRecipes.html"));
});

// Fetch all recipes from Postgres
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recipes LIMIT 6");
    res.json(result.rows); // return as JSON
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// Update recipe by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, image, ingredients, instructions } = req.body;

  try {
    const result = await pool.query(
      `UPDATE recipes
       SET title = $1,
           image = $2,
           ingredients = $3,
           instructions = $4
       WHERE id = $5
       RETURNING *`,
      [
        title,
        image,
        JSON.stringify(ingredients),   // store as JSON
        JSON.stringify(instructions),  // store as JSON
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe updated!", recipe: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database update failed" });
  }
});
// delete recipe by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM recipes WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json({ message: "Recipe deleted", recipe: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database delete failed" });
  }
});
// search recipes based on ingredient 
router.get('/search', async (req,res)=>{
  
try {
    const { ingredients } = req.query;
      if (!ingredients) {
      return res.status(400).json({ error: "ingredients query parameter is required" });
    }
    const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients',{

      params: {
        ingredients,       
        number: 3,         
        apiKey: API_Key,
      },
    });
    const result = response.data.map(recipe => ({
      title: recipe.title,
      image: recipe.image,
      usedIngredients: recipe.usedIngredients.map(i => i.name),
      missedIngredients: recipe.missedIngredients.map(i => i.name),
    }));

    res.json(result);    
} catch (error) {

   console.error(error.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
}
});


module.exports=router;