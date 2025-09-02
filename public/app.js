// random recipes
async function renderRecipes() {
  try {
    const saved = localStorage.getItem("recipes");
    if (saved) {
      const recipes = JSON.parse(saved);
      getdata(recipes);
    } else {
      const response = await fetch("/recipes/api");
      const data = await response.json();
      console.log(data);
      localStorage.setItem("recipes", JSON.stringify(data));
      getdata(data);
    }
  } catch (error) {
    console.error("error", error);
  }
}
function getdata(recipes) {
  const container = document.querySelector(".recipes-container");
  container.innerHTML = "";
  recipes.forEach((e) => {
    const recipeCard = document.createElement("div");
    recipeCard.className = "card";
  
    recipeCard.innerHTML = `  
         <h4 id="title">${e.title}</h4> 
        <img id="image" " src="${e.image}">
<h5 class="ingredients-title">Ingredients:</h5>
  <ul class="ingredients"></ul>
    <h5 class="instructions-title">Instructions:</h5>

        <ol class="instructions"></ol>
  <button class="favorite-btn"> Add to Favorite</button>

        `;
        const ingredientsList = recipeCard.querySelector(".ingredients");

if (Array.isArray(e.ingredients)) {
  e.ingredients.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.trim();
    ingredientsList.appendChild(li);
  });
} else if (typeof e.ingredients === "string") {
  // Fallback if ingredients come as comma-separated string
  const items = e.ingredients.split(',').map(i => i.trim());
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ingredientsList.appendChild(li);
  });
}
    const instructionsList = recipeCard.querySelector(".instructions");
    let steps = [];
    if (typeof e.instructions === "string" && e.instructions.includes("<li>")) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = e.instructions;  // automatically decoded

      const liElements = tempDiv.querySelectorAll("li");
      liElements.forEach((li) => {
        const cleanText = li.textContent.trim();
        if (cleanText) {
          steps.push(cleanText);
        }
      });
    }
      steps.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      instructionsList.appendChild(li);
    });

    container.appendChild(recipeCard);
/// favorite recipes
  const favBtn = recipeCard.querySelector(".favorite-btn");

favBtn.addEventListener("click", () => {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
console.log('clicked');

  // Check if already exists (prevent duplicates)
  const exists = favorites.some(recipe => recipe.title === e.title);

  if (!exists) {
    favorites.push(e); // `e` is the recipe object
    localStorage.setItem("favorites", JSON.stringify(favorites));
    favBtn.textContent = " Added to Favorite";
    favBtn.disabled = true; // prevent multiple clicks
  } else {
    favBtn.textContent = " Already in Favorite";
  }
});

  });

}
renderRecipes();


// search by ingredients
document.getElementById("searchBtn").addEventListener("click", async () => {
  const userInput = document.getElementById("searchInput").value.trim();
  if (!userInput) return alert("Enter some ingredients!");

  try {
    const response = await fetch(`/recipes/search?ingredients=${encodeURIComponent(userInput)}`);
    const data = await response.json();

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
   
    data.forEach((recipe) => {
       const card= document.createElement('div');
    card.className='card';
      card.innerHTML += `
        <div>
          <h3>${recipe.title}</h3>
          <img src="${recipe.image}" width="200">
          <p><b>Used:</b> ${recipe.usedIngredients.join(", ")}</p>
          <p><b>Missing:</b> ${recipe.missedIngredients.join(", ")}</p>
        </div>
      `;
      resultsDiv.appendChild(card)
    });
  } catch (err) {
    console.error(err);
    alert("Error fetching recipes");
  }
});

