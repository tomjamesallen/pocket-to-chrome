'use strict';

import storage from './api/storage';
import Pocket from './api/pocket';
import config from './config';

const api = new Pocket(config.CONSUMER_KEY);

const runAuth = async () => {
  const code = await api.getCode();
  if (!code) return null;
  await api.authorize(code);
  await api.waitForAuth();
  const accessToken = await api.getAccessToken(code);
  if (!accessToken) return null;

  // Save back to storage and then return the token.
  await storage.set(accessToken);
  return accessToken;
};

const getAccessToken = async () => {
  const accessToken = await storage.get();
  return accessToken || (await runAuth());
};

chrome.runtime.onInstalled.addListener(async () => {
  console.log('running');
  const accessToken = await getAccessToken();
  console.log('accessToken: ', accessToken);
});

window.getAccessToken = () => {
  getAccessToken().then(res => {
    console.log('res: ', res);
  });
};

const getList = async () => {
  const accessToken = await getAccessToken();
  console.log('accessToken: ', accessToken);
  const list = await api.getList(accessToken);
  console.log('list: ', list);

  return list;
};

chrome.runtime.onStartup.addListener(function() {
  console.log('start!');
  getList().then(list => {
    console.log('list: ', list);
  });
});

window.getList = () => {
  getList().then(res => {
    console.log('res: ', res);
  });
};

// Notes
// https://developer.chrome.com/extensions/getstarted
// https://getpocket.com/developer/docs/v3/retrieve
// https://getpocket.com/developer/docs/authentication
