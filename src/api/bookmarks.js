import sortby from 'lodash.sortby';
import Logger from '../utils/logger';
import getRawUrl from '../utils/getRawUrl';

const logger = new Logger('bookmarks.js');

const POCKET_BOOKMARKS_FOLDER = 'Pocket Bookmarks';

const FOLDER_ID = '18'; // TODO - keep in local storage

const processItems = (urls, items) => {
  const keys = Object.keys(items).slice(0, 100);
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

const getTree = () => new Promise(resolve => chrome.bookmarks.getTree(resolve));
const get = idOrIdList =>
  new Promise(resolve => chrome.bookmarks.get(idOrIdList, resolve));

const removeFolder = id =>
  new Promise(resolve => chrome.bookmarks.removeTree(id, resolve));

const createFolder = () =>
  new Promise(resolve =>
    chrome.bookmarks.create({ title: POCKET_BOOKMARKS_FOLDER }, resolve),
  );

const resetFolder = async id => {
  await removeFolder(id);
  return createFolder();
};

const saveUrlsAsBookmarks = async urls => {
  logger.trace(`Saving ${urls.length} urls as bookmarks`);

  const folder = await resetFolder(FOLDER_ID);
  console.log('folder: ', folder);
  const tree = await getTree();
  console.log('tree: ', tree);

  const otherBookmarks = await get('Other Bookmarks');
  console.log('otherBookmarks: ', otherBookmarks);
};

class Bookmarks {
  constructor() {}

  addItems = items => {
    const urls = processItems([], items);
    saveUrlsAsBookmarks(urls);
  };
}

export default Bookmarks;
