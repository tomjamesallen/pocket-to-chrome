/* global chrome */
import Logger from '../utils/logger';

const logger = new Logger('storage.js');

class Storage {
  constructor(key) {
    this.key = key;

    this.reset = () => {
      logger.trace(`Resetting ${this.key}`);
      return new Promise(resolve => {
        chrome.storage.sync.remove(this.key, resolve);
      });
    };

    this.set = value => {
      logger.trace(`Setting ${this.key} to`, value);
      return new Promise(resolve => {
        chrome.storage.sync.set({ [this.key]: value }, resolve);
      });
    };

    this.get = () => {
      logger.trace(`Getting ${this.key}`);
      return new Promise(resolve => {
        chrome.storage.sync.get(this.key, data => resolve(data[this.key]));
      });
    };
  }
}

export default Storage;
