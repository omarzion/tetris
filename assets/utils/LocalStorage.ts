import merge from 'deepmerge';
import { findIn } from './Utils';

export default (namespace, deepMergeOpts?) => store => next => action => {
  if (typeof action.type === 'undefined' || typeof action.saveLocally === 'undefined')
    return next(action);

  next(action);
  let mergableState = findIn(store.getState(), action.saveLocally);
  save(namespace, mergableState, deepMergeOpts);
};

export function save(namespace, update, deepMergeOpts?) {
  let currentStorage = load(namespace);
  let toStore = merge(currentStorage, update, deepMergeOpts);
  console.log('save to local storage', toStore);
  localStorage.setItem(namespace, JSON.stringify(toStore));
}

export function load(namespace) {
  let storage = localStorage.getItem(namespace);
  if (!storage) return {};
  return JSON.parse(storage);
}

export const replaceArrOnMerge = { arrayMerge: (dest, source) => source };

export function loadAndMerge(namespace, mergeTo, mergeOpts) {
  return merge(mergeTo, load(namespace), mergeOpts);
}
