import View from './view';
import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _navigation(action) {
    this._parentEl.addEventListener('click', action);
  }

  _generateMarkup(data) {
    this._data = data;
    const curPage = this._data.currentPage;
    const pagesTotal = this._data.totalPages;
    // only one page
    if (pagesTotal === 1 && curPage === pagesTotal) return ``;

    // first page of many
    if (pagesTotal > 1 && curPage === 1)
      return `
        <button class="btn--inline pagination__btn--next" data-go-to=${
          curPage + 1
        }>
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;

    // other page
    if (pagesTotal > 1 && curPage < pagesTotal)
      return `<button class="btn--inline pagination__btn--prev" data-go-to=${
        curPage - 1
      }>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          <button class="btn--inline pagination__btn--next" data-go-to=${
            curPage + 1
          }>
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;

    // last page
    if (pagesTotal === curPage && pagesTotal > 1)
      return `<button class="btn--inline pagination__btn--prev" data-go-to=${
        curPage - 1
      }>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          `;
  }
}

export default new PaginationView();
