'use strict';

import config from './config';
import Pocket from './api/pocket';
import Bookmarks from './api/bookmarks';
import Logger from './utils/logger';

const logger = new Logger('background.js');
const pocket = new Pocket(config.CONSUMER_KEY);
const bookmarks = new Bookmarks();

logger.trace('CONSUMER_KEY', config.CONSUMER_KEY);

const sync = async () => {
  logger.trace('Syncing bookmarks');
  const list = await pocket.getList();
  if (!list) return;
  console.log('list: ', list);

  bookmarks.addItems(list.list);
};

chrome.runtime.onInstalled.addListener(async () => {
  console.log('running');
  sync();
  // const accessToken = await getAccessToken();
  // console.log('accessToken: ', accessToken);
});

chrome.runtime.onStartup.addListener(function() {
  console.log('start!');
  // getList().then(list => {
  //   console.log('list: ', list);
  // });
});

window.getList = () => {
  sync();
};

// Notes
// https://developer.chrome.com/extensions/getstarted
// https://getpocket.com/developer/docs/v3/retrieve
// https://getpocket.com/developer/docs/authentication
