/* eslint no-console: 0 */

import config from '../config';

const getMessageConstructor = area => callback => (
  message,
  other = undefined,
) => {
  if (config.NODE_ENV === 'production') return;
  let toLog = `${area} | ${message}`;
  if (typeof other !== 'undefined') {
    toLog = `${toLog}: ${JSON.stringify(other)}`;
  }
  callback(toLog);
};

export default class Logger {
  constructor(area) {
    const messageConstructor = getMessageConstructor(area);
    this.trace = messageConstructor(console.info);
    this.warn = messageConstructor(console.warn);
    this.error = messageConstructor(console.error);
  }
}
