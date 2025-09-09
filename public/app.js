// const pool = require("../db");

async function renderRecipes() {
  try {
    const response = await fetch("/recipes/all");
    const data = await response.json();
    console.log("Recipes from Postgres:", data);
    getdata(data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
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
      <img id="image" src="${e.image}">
      <h5 class="ingredients-title">Ingredients:</h5>
      <ul class="ingredients"></ul>
      <h5 class="instructions-title">Instructions:</h5>
      <ol class="instructions"></ol>
      <button class="favorite-btn">Add to Favorite</button>
      <button class="updateRecipe">Edit Recipe</button>
      <button class="deleteRecipe">Delete Recipe</button>

    `;

    // Ingredients
    const ingredientsList = recipeCard.querySelector(".ingredients");
    let ingredientsArray = [];
    try {
      ingredientsArray = Array.isArray(e.ingredients) ? e.ingredients : JSON.parse(e.ingredients);
    } catch {
      ingredientsArray = (e.ingredients || "").split(",").map(i => i.trim());
    }

    ingredientsArray.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ingredientsList.appendChild(li);
    });

    // Instructions
    const instructionsList = recipeCard.querySelector(".instructions");

if (e.instructions) {
  let steps = [];

  // Case 1: instructions stored as <li> HTML
  if (e.instructions.includes("<li>")) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = e.instructions;
    tempDiv.querySelectorAll("li").forEach(li => {
      if (li.textContent.trim()) steps.push(li.textContent.trim());
    });
  } else {
    // Case 2: plain text instructions
    // Split by new lines or periods
    steps = e.instructions.split(/\r?\n|\. /).map(s => s.trim()).filter(Boolean);
  }

  // Append to DOM
  steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    instructionsList.appendChild(li);
  });
  const updateBtn = recipeCard.querySelector(".updateRecipe");
  updateBtn.addEventListener("click", () => {
  modal.style.display = "block";

  // Pre-fill form with this recipe’s data
  form.title.value = e.title;
  form.image.value = e.image;
  form.ingredients.value = Array.isArray(e.ingredients) ? e.ingredients.join(", ") : e.ingredients;
  form.instructions.value = Array.isArray(e.instructions) ? e.instructions.join("\n") : e.instructions;

  form.dataset.recipeId = e.id; // store the recipe id for submission
});

}


    // Favorite button
    const favBtn = recipeCard.querySelector(".favorite-btn");
    favBtn.addEventListener("click", () => {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (!favorites.some(r => r.title === e.title)) {
        favorites.push(e);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        favBtn.textContent = "Added to Favorite";
        favBtn.disabled = true;
      } else {
        favBtn.textContent = "Already in Favorite";
      }
    });
//update button
     const updateBtn = recipeCard.querySelector(".updateRecipe");
    updateBtn.addEventListener("click", () => {
      modal.style.display = "block";
      form.title.value = e.title;
      form.image.value = e.image;
      form.ingredients.value = Array.isArray(e.ingredients) ? e.ingredients.join(", ") : e.ingredients;
      form.instructions.value = Array.isArray(e.instructions) ? e.instructions.join("\n") : e.instructions;
      form.dataset.recipeId = e.id;
    });
//delete button
const deleteBtn = recipeCard.querySelector(".deleteRecipe");
deleteBtn.addEventListener("click", async () => {
  if (!confirm(`Are you sure you want to delete "${e.title}"?`)) return;

  try {
    const response = await fetch(`/recipes/${e.id}`, { method: "DELETE" });
    if (response.ok) {
      alert("Recipe deleted!");
      recipeCard.remove(); // remove card from DOM
    } else {
      alert("Failed to delete recipe");
    }
  } catch (err) {
    console.error(err);
  }
});
    container.appendChild(recipeCard);
  });
}
// Modal elements (only once)
const modal = document.getElementById("updateModal");
const form = document.getElementById("updateForm");
const closeModal = document.getElementById("closeModal");

// Close modal handlers
closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

// Handle form submission for updating recipe
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = form.dataset.recipeId;

  const updatedRecipe = {
    title: form.title.value,
    image: form.image.value,
    ingredients: form.ingredients.value.split(",").map(i => i.trim()),
    instructions: form.instructions.value.split("\n").map(i => i.trim())
  };
   try {
    const response = await fetch(`/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRecipe)
    });
    if (response.ok) {
      alert("Recipe updated!");
      modal.style.display = "none";
      window.location.reload(); // refresh the cards to show updated recipe
    } else {
      alert("Failed to update recipe");
    }
  } catch (err) {
    console.error(err);
  }
});




// Call function
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
          <h3 id="title">${recipe.title}</h3>
          <img id="image" src="${recipe.image}" width="200">
          <p class="ingredients"><b>Used:</b> ${recipe.usedIngredients.join(", ")}</p>
          <p class="ingredients" ><b>Missing:</b> ${recipe.missedIngredients.join(", ")}</p>
        </div>
      `;
      resultsDiv.appendChild(card)
    });
  } catch (err) {
    console.error(err);
    alert("Error fetching recipes");
  }
});
