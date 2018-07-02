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

export default storage;
