// Polyfiling
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// import the model and views
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

// import constants
import { MODAL_CLOSE_SEC } from './config';
import shoppingView from './views/shoppingView';

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // 0. Update results & bookmarks views to mark the selected recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. Load the recipe
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    console.log(model.state.recipe);
    // 2. Render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function (ing = '') {
  try {
    // 1. Get search query
    const query = ing || searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results - Always on Page 1 after a search
    resultsView.render(model.getSearchResultsPage(1));

    // 4. Render original pagination btns
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

const controlPagination = function (page) {
  // 1. Render NEW results
  resultsView.render(model.getSearchResultsPage(page));

  // 2. Update pagination btns
  paginationView.update(model.state.search);
};

const controlServings = function (servings) {
  // 1. Update the recipe servings
  model.updateServings(servings);

  // 2. Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add/Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe & results view
  recipeView.update(model.state.recipe);
  resultsView.update(model.getSearchResultsPage());

  // 3. Render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlAddIngredients = function (index) {
  // 1. Add/Remove Ingredients
  if (model.state.recipe.ingredients[index].inCart)
    model.deleteShoppingList(model.state.recipe.ingredients[index]);
  else model.addShoppingList(model.state.recipe.ingredients[index]);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render shopping list view
  shoppingView.render(model.state.shoppingList);
};

const controlDelIng = function (id) {
  // 1. Delete ingredient from list
  model.deleteShoppingList(id);

  // 2. Render the list
  shoppingView.render(model.state.shoppingList);

  // 3. Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Sucess Message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.closeWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  } finally {
    // Regenerate Form
    setTimeout(function () {
      addRecipeView.render();
    }, (MODAL_CLOSE_SEC + 1) * 1000);
  }
};

const init = function () {
  // Handlers
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerAddIngredients(controlAddIngredients);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);

  shoppingView.addHandlersIng(controlSearchResults, controlDelIng);

  // Render Bookmarks & Shopping List locally storaged
  bookmarksView.render(model.state.bookmarks);
  shoppingView.render(model.state.shoppingList);

  // Render hidden addRecipe form
  addRecipeView.render();
};
init();
