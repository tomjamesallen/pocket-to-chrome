import config from '../config';

const getMessageConstructor = area => callback => (message, other = null) => {
  if (config.NODE_ENV === 'production') return;
  let toLog = `${area} | ${message}`;
  if (other) {
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
