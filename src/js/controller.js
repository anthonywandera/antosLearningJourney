import 'core-js/stable';
import 'regenerator-runtime/runtime';
import model from './model.js';
import recipeView from './recipeView.js';
import view from './recipeView.js';
import searchView from './searchView.js';
import resultsView from './resultsView.js';
import paginationView from './paginationView.js';
import bookmarksView from './bookmarksView.js';
import newRecipe from './newRecipe.js';
import { KEY, API_URL } from './config.js';
import { timeout } from './helpers.js';
// import servingsView from './servings.js';
// import icons from 'url:../img/icons.svg';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
async function appInit(e) {
  try {
    // load bookmarks from storage
    bookmarksView._loadBookmarks();
    newRecipe._upload(uploadRecipe);

    newRecipe._closeForm(closeRecipeForm);

    newRecipe._openForm(NewRecipeForm);
    // newRecipe._upload(uploadRecipe);

    const id = window.location.hash?.slice(1);
    if (!id) return;
    view.renderSpinner();
    await Promise.race([await model.loadRecipe(id), timeout()]);
    // await model.loadRecipe(id);
    recipeView.render(model.recipe);

    // attach event handlers to servings btns
    recipeView.addBookMark(recipeAddBookmark);
    recipeView._addHandlerServings(changeServings);
    // attach eventhandlers to pagination btns
    paginationView._navigation(navigation);
  } catch (err) {
    recipeView.renderError(err);
  }
}

// add bookmark
function recipeAddBookmark() {
  if (!this._data.bookmarked) {
    console.log(this);
    this._bookmarks.push(this._data);
    localStorage.setItem('bookmarks', JSON.stringify(this._bookmarks));
    // console.log(this._bookmarks);
    this._data.bookmarked = true;
    this.render(this._data);
    recipeView.addBookMark(recipeAddBookmark);
  } else {
    const delIndex = this._bookmarks.findIndex(rec => rec.id === this._data.id);
    this._bookmarks.splice(delIndex, 1);
    this._data.bookmarked = false;
    localStorage.setItem('bookmarks', JSON.stringify(this._bookmarks));
    this.render(this._data);
    recipeView.addBookMark(recipeAddBookmark);
  }
  // load bookmarks from storage
  bookmarksView._loadBookmarks();
  recipeView._addHandlerServings(changeServings);
  // bookmarksView.render(this._bookmarks);
}

// add search function
searchView.addHandler(async function (e) {
  try {
    e.preventDefault();
    resultsView.renderSpinner();
    const x = await searchView.search();
    resultsView._currentPage = 1;
    resultsView.render(x);
    renderPagination(resultsView._state);
  } catch (err) {
    resultsView.renderError(err);
  }
});

// render the pagination
async function renderPagination(state) {
  paginationView.render(state);
}

// navigate btwn pages
function navigation(e) {
  if (!e.target.closest('.btn--inline')) return;
  const btn = +e.target.closest('.btn--inline').dataset.goTo;
  resultsView._currentPage = btn;
  resultsView.render(resultsView._data);
  renderPagination(resultsView._state);
}

// change the servings
function changeServings(e) {
  console.log('attached');
  if (!e.target.closest('.btn--tiny')) return;
  const btn = e.target.closest('.btn--tiny');
  const newServings = +e.target.closest('.btn--tiny').dataset.value;
  if (newServings === 0) return;
  recipeView._data.ingredients.forEach(function (ing) {
    ing.quantity = ing.quantity * (newServings / recipeView._data.servings);
  });

  // console.log(recipeView._data.ingredients);
  recipeView._data.servings = newServings;
  recipeView.render(recipeView._data);
  // attach event handlers to servings btns
  recipeView._addHandlerServings(changeServings);
  recipeView.addBookMark(recipeAddBookmark);
}

function NewRecipeForm() {
  this._parentEl.innerHTML = this.generateMarkup();
  this._addRecipeWindowEl.classList.remove('hidden');
  this._overlayEl.classList.remove('hidden');
}

function closeRecipeForm() {
  this._addRecipeWindowEl.classList.add('hidden');
  this._overlayEl.classList.add('hidden');
}

function uploadRecipe(e) {
  e.preventDefault();
  const data = [...new FormData(this._parentEl)];
  formValidation.bind(this)(data);
}

async function formValidation(data) {
  try {
    if (!data) return;
    data.forEach(item => {
      if (item[0].startsWith('ingredient') && item[1] !== '') {
        if (item[1].split(',').length < 3)
          throw new Error(
            'Please use the right format to fill ingredient data '
          );
      }
    });

    // convert to right format
    const dataObj = Object.fromEntries(data);
    const ingerdientsObj = Object.entries(dataObj)
      .filter(ent => ent[0].startsWith('ingredient') && ent[1] !== '')
      .map(ent => ent[1]);

    const ingredients = ingerdientsObj.map(function (ent) {
      ent = ent.split(',');
      return {
        quantity: ent[0] ? +ent[0] : null,
        unit: ent[1] ? ent[1] : '',
        description: ent[2],
      };
    });

    const cont = {
      title: dataObj.title,
      source_url: dataObj.sourceUrl,
      image_url: dataObj.image,
      publisher: dataObj.publisher,
      cooking_time: +dataObj.cookingTime,
      servings: +dataObj.servings,
      ingredients,
    };

    console.log(cont);

    if (cont.source_url?.length < 5)
      throw new Error('Source URL should at least be 5 characters long');

    // start upload
    this.renderSpinner();
    const fetchPost = await fetch(`${API_URL}?key=${KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cont),
    });

    const customRecipe = await fetchPost.json();
    bookmarkNewRecipe(customRecipe);

    const uploadResponse = await Promise.race([fetchPost, timeout()]);
    if (!uploadResponse.ok) throw new Error(uploadResponse.statusText);
  } catch (err) {
    newRecipe.renderError(err);
  }
}

async function bookmarkNewRecipe(recipe) {
  console.log(recipe.data.recipe);
  window.history.pushState(undefined, '', `#${recipe.data.recipe.id}`);
  const id = window.location.hash?.slice(1);

  // render
  if (!id) return;
  view.renderSpinner();
  await Promise.race([await model.loadRecipe(id), timeout()]);
  // await model.loadRecipe(id);
  // recipeView.render(model.recipe);

  // add to bookmarks
  recipeView._bookmarks.push(recipe.data.recipe);
  localStorage.setItem('bookmarks', JSON.stringify(recipeView._bookmarks));
  // console.log(this._bookmarks);
  recipeView._data.bookmarked = true;
  newRecipe.renderMessage();
  bookmarksView._loadBookmarks();
  recipeView.render(recipe.data.recipe);
  // setTimeout(() => {
  //   document.querySelector('.upload').classList.add('hidden');
  //   document.querySelector('.overlay').classList.add('hidden');
  //   document.querySelector('.add-recipe-window').classList.add('hidden');
  // }, 800);
}

// start application
recipeView.init(appInit);
