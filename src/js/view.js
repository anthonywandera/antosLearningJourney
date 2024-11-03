import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import model from './model.js';

export default class View {
  _data = {};
  _bookmarks = localStorage.getItem('bookmarks')
    ? JSON.parse(localStorage.getItem('bookmarks'))
    : [];

  render(recipe) {
    this._parentEl.innerHTML = '';
    this._parentEl.insertAdjacentHTML(
      'afterbegin',
      this._generateMarkup(recipe)
    );
  }

  // FIX LATER

  // update() {
  //   const x = document
  //     .createRange()
  //     .createContextualFragment(this._generateMarkup(this._data));

  //   const newMarkup = Array.from(x.childNodes);
  //   const oldMarkup = Array.from(this._parentEl.childNodes);
  //   oldMarkup.forEach(function (el) {
  //     console.log(el);
  //   });
  // }

  renderSpinner() {
    this._parentEl.innerHTML = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> `;
  }

  renderError(err = 'No recipes found for your query. Please try again!') {
    this._parentEl.innerHTML = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${err.message}</p>
    </div>`;
  }

  renderMessage(msg = 'Success') {
    this._parentEl.innerHTML = `<div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${msg}!</p>
        </div>`;
  }
}
