'use strict';

const storage = {
  reset: () =>
    new Promise(resolve => {
      chrome.storage.sync.clear(resolve);
    }),
  set: accessToken =>
    new Promise(resolve => {
      chrome.storage.sync.set({ accessToken }, resolve);
    }),
  get: () =>
    new Promise(resolve => {
      chrome.storage.sync.get(data => resolve(data.accessToken));
    }),
};

const api = {
  getCode: async () =>
    fetch('https://getpocket.com/v3/oauth/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: '63325-942e4030a60f61d0fe170393',
        redirect_uri: 'https://localhost:3000',
      }),
    })
      .then(res => res.json())
      .then(res => res.code)
      .catch(() => null),
  authorize: code => {
    console.log('authorize', code);
    window.open(
      `https://getpocket.com/auth/authorize?request_token=${code}&redirect_uri=https://getpocket.com/`,
    );
  },
  waitForAuth: () =>
    new Promise(resolve => {
      chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status == 'complete') {
          if (tab.url === 'https://getpocket.com/a/queue/') {
            resolve();
          }
        }
      });
    }),
  getAccessToken: () => new Promise(resolve => {}),
};

const runAuth = async () => {
  console.log('runAuth: ');
  // Do all the auth stuff.
  const accessToken = `${String(Date.now())}`;

  const code = await api.getCode();
  console.log('code: ', code);
  await api.authorize(code);
  await api.waitForAuth();
  console.log('auth done');

  // Save back to storage and then return the token.
  await storage.set(accessToken);
  return accessToken;
};

const getAccessToken = async () => {
  const accessToken = await storage.get();
  console.log('accessToken: ', accessToken);
  return await runAuth();
  // return accessToken || (await runAuth());
};

chrome.runtime.onInstalled.addListener(async () => {
  console.log('running');
  // const accessToken = await getAccessToken();
  // console.log('accessToken: ', accessToken);

  window.getAccessToken = getAccessToken;
});

chrome.runtime.onStartup.addListener(function() {
  console.log('start!');
});
