import View from './view.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import icons from 'url:../img/icons.svg';
import model from './model.js';

class bookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');

  //   constructor() {
  //     super();
  //     this._loadBookmarks();
  //   }

  _loadBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    if (!bookmarks) return;
    this.render(bookmarks);
    console.log('begin load');
  }

  render(recipe) {
    this._bookmarks.push(recipe);
    this._parentEl.innerHTML = '';
    this._parentEl.insertAdjacentHTML(
      'afterbegin',
      this._generateMarkup(recipe)
    );
  }

  _generateMarkup(bookmarks) {
    return bookmarks.reduce((html, rec) => {
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
                  <div class="preview__user-generated ${
                    rec.key ? '' : 'hidden'
                  }">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
                </div>
              </a>`
      );
    }, '');
  }
}

export default new bookmarksView();
