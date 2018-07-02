class Pocket {
  constructor(consumerKey) {
    this.consumerKey = consumerKey;
  }

  getCode = async () =>
    fetch('https://getpocket.com/v3/oauth/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: this.consumerKey,
        redirect_uri: 'https://localhost:3000',
      }),
    })
      .then(res => res.json())
      .then(res => res.code)
      .catch(() => null);

  authorize = code => {
    window.open(
      `https://getpocket.com/auth/authorize?request_token=${code}&redirect_uri=https://getpocket.com/`,
    );
  };

  waitForAuth = () =>
    new Promise(resolve => {
      chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status == 'complete') {
          if (tab.url === 'https://getpocket.com/a/queue/') {
            resolve();
          }
        }
      });
    });

  getAccessToken = async code =>
    fetch('https://getpocket.com/v3/oauth/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: this.consumerKey,
        access_token: code,
      }),
    })
      .then(res => res.json())
      .then(res => res.access_token)
      .catch(() => null);

  getList = async accessToken =>
    fetch('https://getpocket.com/v3/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: this.consumerKey,
        access_token: accessToken,
        state: 'all',
        detailType: 'simple',
      }),
    })
      .then(res => res.json())
      .catch(() => null);
}
