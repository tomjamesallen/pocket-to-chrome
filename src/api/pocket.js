import Storage from './storage';
import Logger from '../utils/logger';
const logger = new Logger('pocket.js');

const accessTokenStorage = new Storage('accessToken');

const getCode = async consumerKey =>
  fetch('https://getpocket.com/v3/oauth/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Accept': 'application/json',
    },
    body: JSON.stringify({
      consumer_key: consumerKey,
      redirect_uri: 'https://localhost:3000',
    }),
  })
    .then(res => res.json())
    .then(({ code }) => code)
    .catch(() => null);

const authorize = code => {
  window.open(
    `https://getpocket.com/auth/authorize?request_token=${code}&redirect_uri=https://getpocket.com/`,
  );

  return new Promise(resolve => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status == 'complete') {
        if (tab.url === 'https://getpocket.com/a/queue/') {
          resolve();
        }
      }
    });
  });
};

const getAccessToken = async (consumerKey, code) =>
  fetch('https://getpocket.com/v3/oauth/authorize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Accept': 'application/json',
    },
    body: JSON.stringify({
      consumer_key: consumerKey,
      code,
    }),
  })
    .then(res => res.json())
    .then(res => res.access_token)
    .catch(() => null);

const getList = async (consumerKey, accessToken) =>
  fetch('https://getpocket.com/v3/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Accept': 'application/json',
    },
    body: JSON.stringify({
      consumer_key: consumerKey,
      access_token: accessToken,
      state: 'all',
      detailType: 'simple',
    }),
  })
    .then(res => res.json())
    .catch(() => null);

class Pocket {
  constructor(consumerKey) {
    this.consumerKey = consumerKey;
    this.code = null;
    this.accessToken = null;
  }

  reset = async () => {
    this.code = null;
    this.accessToken = null;
    await accessTokenStorage.reset();
  };

  runAuth = async () => {
    // https://getpocket.com/developer/docs/authentication
    logger.trace('runAuth');
    // Do all the auth stuff and then return the access token.

    // The first step is to get a code from the API.
    this.code = this.code || (await getCode(this.consumerKey));
    logger.trace('this.code', this.code);
    if (!this.code) return null;

    await authorize(this.code);
    this.accessToken = await getAccessToken(this.consumerKey, this.code);

    return this.accessToken;
  };

  getAccessToken = async () => {
    logger.trace('getAccessToken');
    this.accessToken =
      this.accessToken ||
      (await accessTokenStorage.get()) ||
      (await this.runAuth());

    if (this.accessToken) {
      await accessTokenStorage.set(this.accessToken);
    }
    return this.accessToken;
  };

  getList = async (retry = true) => {
    // https://getpocket.com/developer/docs/v3/retrieve
    logger.trace('getList');
    const accessToken = await this.getAccessToken();
    logger.trace('accessToken: ', accessToken);
    if (!accessToken) return null;
    const list = await getList(this.consumerKey, accessToken);
    if (list && list.list) {
      logger.trace(`returned ${Object.keys(list.list).length} items`);
      return { list: list.list };
    }

    if (retry) {
      this.reset();
      logger.trace('no result - retrying');
      return await this.getList(false);
    }

    return null;
  };
}

export default Pocket;
