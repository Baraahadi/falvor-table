# 🍽️ Flavor Table Project

A simple project that fetches recipes from an API with the ability to geneeate random recipes,search, add favorites, and remove them.

---

## 🚀 Features
- **Get a random recipe** from the API (`/recipes/random`)
- **Search for recipes** by ingredient (`/recipes/search`)
- **Add recipes to favorites**
- **Remove recipes from favorites**
- **Simple user interface** built with HTML + CSS + JavaScript
- **Organized code using Routing** with Express.js

---

## 🛠️ Technologies Used
- **Backend:** Node.js + Express.js + axios
- **Frontend:** HTML, CSS, JavaScript
- **API:** [Spoonacular API] 
- **Storage:** Local Storage for favorites

---

## 🧑‍💻 How It Works
- **Random Recipe:**  
  When the user clicks on "Random", the app makes a request to `/recipes/random`, fetches a random recipe from the API, and displays it with its image, ingredients, and instructions.

- **Search Recipe:**  
  The user enters an ingredient in the search input. The app sends this value as a query parameter to `/recipes/search`. The results are displayed in cards (each card shows recipe title, image, and a button to add to favorites).

- **Add to Favorites:**  
  Each recipe card has an "Add to Favorites" button. When clicked, the recipe data is saved in **Local Storage** so it remains even after page refresh.

- **View Favorites:**  
  On the Favorites page, all saved recipes are displayed. Each recipe is shown as a card with an image, title, and a delete button.

- **Delete from Favorites:**  
  When the delete button is clicked, the recipe is removed from Local Storage and the UI updates automatically.

---

## ✅ What I Implemented
- Created **Routing** for recipes (`/recipes/random` and `/recipes/search`) using Express.js.
- Fetched recipe data from an **[external API](https://api.spoonacular.com)** and displayed it on the frontend.
- Built a **search functionality** where the user can enter keywords/ingredients to get recipe results.
- Designed and implemented a **Random Recipe Page** that fetches and shows a random recipe with image, ingredients, and instructions.

- Added a **Favorites system**:
  - Save recipes to favorites using **Local Storage**.
  - Display saved favorites on a separate page.
  - Delete recipes from favorites and update the UI dynamically.

- Designed a simple and clean **UI** with:
  - **SideBar** for navigation.
  - **Footer** fixed at the bottom of the page.
  - Recipe results displayed as **cards** for better user experience.

---
### ⏱️ How many hours did it take you to complete this assignment?
**About 10 hours**

### 🧩 Were there any parts of the lab you found challenging?
Yes, the main challenge I faced was **how to implement routing between pages** (navigating from one page to another correctly using Express.js and the frontend).

