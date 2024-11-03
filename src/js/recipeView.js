import icons from 'url:../img/icons.svg';
import fracty from 'fracty';
import View from './view';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import model from './model.js';

class RecipeView extends View {
  _parentEl = document.querySelector('.recipe');

  _generateMarkup(recipe) {
    this._data = recipe;
    this._bookmarks.some(rec => rec.id === this._data.id)
      ? (recipe.bookmarked = true)
      : recipe.bookmarked;
    console.log('hey');
    return `
        <figure class="recipe__fig">
          <img src="${recipe.image_url}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cooking_time
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--decrease-servings" data-value=${
                recipe.servings - 1
              }>
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings" data-value=${
                recipe.servings + 1
              }>
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${recipe.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      recipe.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${recipe.ingredients.reduce((html, ingredient) => {
            return (
              html +
              `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}.svg#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                ingredient.quantity ? fracty(ingredient.quantity) : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.description}
              </div>
            </li>`
            );
          }, '')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.source_url}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }

  _addHandlerServings(handler) {
    this._parentEl
      .querySelector('.recipe__info-buttons')
      .addEventListener('click', handler);
  }

  addBookMark(handler) {
    document
      .querySelector('.btn--round')
      .addEventListener('click', handler.bind(this));
  }

  init(callback) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, callback));
  }
}

export default new RecipeView();
