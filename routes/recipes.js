require('dotenv').config();
const API_Key= process.env.API;
const express = require('express');
const axios= require('axios');
const path = require("path");
const router= express.Router();
// rendering recipes API 
router.get("/api",async(req, res)=>{
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/random', {
      params: {
        apiKey: API_Key,
        number:3
      }
    });
   console.log(response);
    const recipes= response.data.recipes.map(e => ({
      title: e.title,
      image:e.image,
      instructions: e.instructions,
      ingredients:e.extendedIngredients.map(ing=>ing.original)
    }));
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }


});
// rendering recipes randomly
router.get("/random",(req,res)=>{
   res.sendFile(path.join(__dirname, "../public/randomRecipes.html"));
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