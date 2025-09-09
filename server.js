require('dotenv').config();
//import API KEY 
const API_Key= process.env.API;
// import packages
const express = require('express');
const axios= require('axios');
const path = require("path");
const cors=require('cors');
const pool = require("./db")
// initialize express 
const app = express();
app.use(cors());
// app.express.json();
//middleware 
app.use(express.static(path.join(__dirname, "public")));

app.get("/test", async (req, res) => {
  try {
    const response = await fetch("http://localhost:5000/recipes/api");
    const data = await response.json();
    console.log("API returned data:", data);
  console.log("Number of recipes:", data.length);
    for (const recipe of data) {
      await pool.query(
        `INSERT INTO recipes (title, image, instuctions, ingredients, readyin)
         VALUES ($1, $2, $3, $4 , $5)`,
        [
          recipe.title,
          recipe.image,
          recipe.instructions, // 👈 match your table
          JSON.stringify(recipe.ingredients),
          recipe.readyInMinutes,
        ]
      );
    }

    res.send("Recipes imported successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error importing recipes");
  }
});

const home= require('./routes/home')
const recipesRoute= require('./routes/recipes');
const randomRecipes=require('./routes/recipes');
const recipeSearch=require('./routes/recipes')
app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style.css"));
});
app.get("/app.js", (req, res) => {
  res.sendFile(path.join(__dirname, "app.js"));
});
app.use('/',home)
app.use('/recipes', recipesRoute);
app.use('/recipes',randomRecipes);
app.use('/recipes',recipeSearch);

const PORT = process.env.PORT || 3000;
// app.listen(PORT, ()=>{
//     console.log(`Server running on http://localhost:${PORT}`);
// })

pool.connect()
.then(
  ()=>{app.listen(PORT,()=>
    console.log(`App is listening on port http://localhost:${PORT}`))}
  ).catch((err)=>{console.error("couldnt connect to database",err);
  });