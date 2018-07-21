import sortby from 'lodash.sortby';
import Logger from '../utils/logger';
import getRawUrl from '../utils/getRawUrl';

const logger = new Logger('bookmarks.js');

const POCKET_BOOKMARKS_FOLDER = 'Pocket Bookmarks';

const processItems = (urls, items, limit = undefined) => {
  const keys = Object.keys(items).slice(0, limit);
  logger.trace(`addItems - ${keys.length} items`);

  keys.forEach(key => {
    const item = items[key];
    const url = item.given_url && getRawUrl(item.given_url);
    if (url && !urls.find(item => item.url === url)) {
      urls.push({ url, title: item.given_title || url });
    }
  });

  return sortby(urls, item => item.url);
};

const getFolderMatches = () =>
  new Promise(resolve =>
    chrome.bookmarks.search({ title: POCKET_BOOKMARKS_FOLDER }, resolve),
  );

const removeFolder = async () => {
  const oldFolder = await getFolderMatches();
  return Promise.all(
    oldFolder.map(
      folder =>
        new Promise(res => {
          chrome.bookmarks.removeTree(folder.id, res);
        }),
    ),
  );
};

const createFolder = () =>
  new Promise(resolve =>
    chrome.bookmarks.create({ title: POCKET_BOOKMARKS_FOLDER }, resolve),
  );

const resetFolder = async () => {
  await removeFolder();
  return createFolder();
};

const saveUrlsAsBookmarks = async urls => {
  logger.trace(`Saving ${urls.length} urls as bookmarks`);

  const folder = await resetFolder();
  logger.trace('reset folder');

  await Promise.all(
    urls.map(
      ({ title, url }) =>
        new Promise(resolve => {
          chrome.bookmarks.create({ parentId: folder.id, title, url }, resolve);
        }),
    ),
  );
};

class Bookmarks {
  constructor() { }

  addItems = async items => {
    const urls = processItems([], items);
    await saveUrlsAsBookmarks(urls);
    logger.trace('items added');
  };
}

export default Bookmarks;
