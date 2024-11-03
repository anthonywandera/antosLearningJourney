import icons from 'url:../img/icons.svg';
import { getJSON, timeout } from './helpers.js';
import { API_URL } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import model from './model.js';

class State {
  recipe = {};
  bookmarks = [];

  async loadRecipe(id) {
    try {
      const response = await Promise.race([
        timeout(),
        await fetch(`${API_URL}${id}`),
      ]);

      if (!response.ok) {
        throw new Error('(HTTP Request unsuccessful) Invalid request');
      }

      const recipes = await getJSON(response);
      const { recipe } = recipes.data;
      this.recipe = recipe;
    } catch (err) {
      throw err;
    }
  }
}

export default new State();
