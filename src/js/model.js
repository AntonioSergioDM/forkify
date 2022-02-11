import { v4 as uuid } from 'uuid';
import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helpers';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
  shoppingList: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  const newRecipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: state.bookmarks.some(book => book.id === recipe.id),
    ...(recipe.key && { key: recipe.key }),
  };
  newRecipe.ingredients.forEach(ing => {
    if (state.shoppingList.some(ingList => isIngEqual(ing, ingList)))
      ing.inCart = true;
  });

  return newRecipe;
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);
  } catch (err) {
    console.error(err, `${err.message} in loadRecipe (model.js)`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        bookmarked: state.bookmarks.some(book => book.id === recipe.id),
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    console.error(`${err} in loadSearchResults (model.js)`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (servings) {
  const factor = servings / state.recipe.servings;

  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= factor;
  });

  state.recipe.servings = servings;
};

const persistData = function (dataName) {
  localStorage.setItem(dataName, JSON.stringify(state[dataName]));
};

export const addBookmark = function (recipe) {
  // 1. Add bookmark
  state.bookmarks.push(recipe);

  // 2. Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  /// in the search results array too
  state.search.results.forEach(res => {
    if (res.id === recipe.id) res.bookmarked = true;
  });

  // 3. Persist data
  persistData('bookmarks');
};

export const deleteBookmark = function (id) {
  // 1. Delete bookmark
  const index = state.bookmarks.findIndex(book => book.id === id);
  state.bookmarks.splice(index, 1);

  // 2. Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  /// in the search results array too
  state.search.results.forEach(res => {
    if (res.id === id) res.bookmarked = false;
  });

  // 3. Persist data
  persistData('bookmarks');
};

const isIngEqual = function (ing1, ing2) {
  return ing1.description === ing2.description;
};

export const addShoppingList = function (ing) {
  let indexShop = state.shoppingList.findIndex(listIng =>
    isIngEqual(listIng, ing)
  );
  const indexRecipe = state.recipe.ingredients.findIndex(recipeIng =>
    isIngEqual(recipeIng, ing)
  );

  // 1. Add to shopping list
  if (indexShop < 0) {
    indexShop =
      state.shoppingList.push({
        ...ing,
        id: uuid(),
        image: state.recipe.image,
        title: state.recipe.title,
      }) - 1;
  } else if (
    (ing.title || state.recipe.title) !== state.shoppingList[indexShop].title
  )
    state.shoppingList[indexShop].title = `${
      state.shoppingList[indexShop].title
    } | ${ing.title || state.recipe.title}`;

  // Flag in the recipe
  if (indexRecipe >= 0) state.recipe.ingredients[indexRecipe].inCart = true;

  // 2. Persist data
  persistData('shoppingList');
};

export const deleteShoppingList = function (idOrIng) {
  let index;
  // 1. Delete recipe ing
  if (typeof idOrIng !== 'string')
    index = state.shoppingList.findIndex(ing => isIngEqual(ing, idOrIng));
  else index = state.shoppingList.findIndex(ing => ing.id === idOrIng);
  const [ingRemoved] = state.shoppingList.splice(index, 1);

  // 2. Remove tag if in recipe
  state.recipe.ingredients.forEach(ing => {
    if (isIngEqual(ing, ingRemoved)) ing.inCart = false;
  });

  // 3. Persist data
  persistData('shoppingList');
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients: newRecipe.ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const loadData = function (dataName) {
  const storage = localStorage.getItem(dataName);
  if (storage) state[dataName] = JSON.parse(storage);
};

const init = function () {
  loadData('bookmarks');
  loadData('shoppingList');
};
init();

//For Development
const clearData = function (dataName) {
  localStorage.clear(dataName);
};
// clearData('bookmarks);
// clearData('shoppingList');
