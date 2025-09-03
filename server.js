require('dotenv').config();
//import API KEY 
const API_Key= process.env.API;
// import packages
const express = require('express');
const axios= require('axios');
const path = require("path");
const cors=require('cors');
// initialize express 
const app = express();
app.use(cors());

//middleware 
app.use(express.static(path.join(__dirname, "public")));


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
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})