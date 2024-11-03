import { TIMEOUT } from './config';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

export async function getJSON(res) {
  const x = await res.json();
  return x;
}

export const timeout = function (s = TIMEOUT) {
  try {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} seconds`));
      }, s * 1000);
    });
  } catch (err) {
    throw err;
  }
};
