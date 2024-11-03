import View from './view';
import { getJSON, timeout } from './helpers';
import { API_URL, KEY } from './config';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import model from './model.js';

class searchView extends View {
  _parentEl = document.querySelector('.search');

  async search(query) {
    try {
      // get input
      query = this._parentEl.querySelector('.search__field').value;

      // clear input field
      this._parentEl.querySelector('.search__field').value = '';

      if (!query) throw new Error('Please enter a rceipe name');
      this.keyword = query;
      const prom = await Promise.race([
        fetch(`${API_URL}/?search=${query}&key=${KEY}`),
        timeout(),
      ]);
      const res = await getJSON(prom);
      if (res.results === 0) throw new Error('Recipe does not exist');
      this._data = res.data.recipes;
      return this._data;
    } catch (err) {
      throw err;
    }
  }

  addHandler(handler) {
    this._parentEl.addEventListener('submit', handler);
  }
}

export default new searchView();
