'use strict';

import Pocket from './api/pocket';
import config from './config';
import Logger from './utils/logger';
const logger = new Logger('background.js');

const api = new Pocket(config.CONSUMER_KEY);
const pocket = new Pocket(config.CONSUMER_KEY);

logger.trace('CONSUMER_KEY', config.CONSUMER_KEY);

chrome.runtime.onInstalled.addListener(async () => {
  console.log('running');
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
  pocket.getList().then(res => {
    console.log('res: ', res);
  });
};

// Notes
// https://developer.chrome.com/extensions/getstarted
// https://getpocket.com/developer/docs/v3/retrieve
// https://getpocket.com/developer/docs/authentication
