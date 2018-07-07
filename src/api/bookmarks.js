import sortby from 'lodash.sortby';
import Logger from '../utils/logger';
import getRawUrl from '../utils/getRawUrl';

const logger = new Logger('bookmarks.js');

const processItems = (urls, items) => {
  const keys = Object.keys(items).slice(0, 100);
  logger.trace(`addItems - ${keys.length} items`);

  keys.forEach(key => {
    const item = items[key];
    const url = item.given_url && getRawUrl(item.given_url);
    if (url && urls.indexOf(url) < 0) {
      urls.push(url);
    }
  });

  return sortby(urls);
};

const saveUrlsAsBookmarks = urls => {
  logger.trace(`Saving ${urls.length} urls as bookmarks`);
};

class Bookmarks {
  constructor() {}

  addItems = items => {
    const urls = processItems([], items);
    saveUrlsAsBookmarks(urls);
  };
}

export default Bookmarks;
