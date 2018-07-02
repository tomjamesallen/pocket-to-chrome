'use strict';

const CONSUMER_KEY = '63325-942e4030a60f61d0fe170393';

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
        consumer_key: CONSUMER_KEY,
        redirect_uri: 'https://localhost:3000',
      }),
    })
      .then(res => res.json())
      .then(res => res.code)
      .catch(() => null),
  authorize: code => {
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
  getAccessToken: async code =>
    fetch('https://getpocket.com/v3/oauth/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: CONSUMER_KEY,
        access_token: code,
      }),
    })
      .then(res => res.json())
      .then(res => res.access_token)
      .catch(() => null),
  getList: async accessToken =>
    fetch('https://getpocket.com/v3/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: CONSUMER_KEY,
        access_token: accessToken,
        state: 'all',
        detailType: 'simple',
      }),
    })
      .then(res => res.json())
      .catch(() => null),
};

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
