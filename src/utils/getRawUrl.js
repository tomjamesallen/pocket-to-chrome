export default inputUrl =>
  ['?', '#'].reduce((url, delimiter) => url.split(delimiter)[0], inputUrl);
