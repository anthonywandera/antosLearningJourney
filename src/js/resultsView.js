import View from './view';
import { RECIPE_PER_PAGE } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import icons from 'url:../img/icons.svg';
import recipeView from './recipeView.js';

class resultsView extends View {
  _parentEl = document.querySelector('.results');
  _currentPage = 6;
  _resultsPerPage = RECIPE_PER_PAGE;

  _generateMarkup(results) {
    this._data = results;
    this._totalPages = Math.ceil(this._data?.length / this._resultsPerPage);
    results = this._getResultsPerPage();
    const x = results?.reduce((html, rec) => {
      return (
        html +
        `
          <li class="preview">
            <a class="preview__link" href="#${rec.id}">
              <figure class="preview__fig">
                <img src="${rec.image_url}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${rec.title} ...</h4>
                <p class="preview__publisher">${rec.publisher}</p>
                <div class="preview__user-generated ${rec.key ? '' : 'hidden'}">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>`
      );
    }, '');

    this._state = {
      data: this._data,
      currentPage: this._currentPage,
      resultsPerPage: this._resultsPerPage,
      totalPages: this._totalPages,
    };
    return x;
  }

  _getResultsPerPage(curPage = this._currentPage) {
    const start = (curPage - 1) * this._resultsPerPage;
    const stop = curPage * this._resultsPerPage;
    return this._data?.slice(start, stop);
  }
}
export default new resultsView();
