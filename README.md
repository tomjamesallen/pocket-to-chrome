## About

This project is a chrome extension that will pull a user's bookmarks from Pocket and save them as Chrome bookmarks.

The extension is currently unlisted, but can be found [here](https://chrome.google.com/webstore/detail/pocket-to-chrome/lpbebchkceikmagjjlfllaoiniakaabh).

## Getting set up / building

Please read https://developer.chrome.com/extensions/getstarted as a primer to developing chrome extensions. This extension just depends on one background script. The entry point is `src/background.js`.

### Installing prerequisites

You will need node or yarn to build the output JS.

Run `npm install` / `yarn install` to pull project dependencies.

### Pocket API and consumer key

To use the Pocket API you will need an API key. You can create an API consumer key at https://getpocket.com/developer/apps/ with a free Pocket account. You will need to set up an App that has permission to read a user's bookmarks. Once you have your consumer key you will need to create a `.env` file which contains your consumer key (see `.env.example`).

### Building

Once you have the dependencies and the `.env` file set up you should be ready to build the project. `yarn build` (or `npm run build`) will build the production JS. `yarn develop` (or `npm run develop`) will start the development build and watch for changes. The output JS will be bundled into the folder `pocket-to-chrome-extension`.

### Installing extension in chrome

To work with the extension in chrome open up `chrome://extensions/` and click "Load Unpacked" (top left). Select the nested directory `pocket-to-chrome-extension`. You can then inspect the `background page` view, or refresh the plugin to re-run the startup script.

### Code formatting / linting

This project uses Prettier and Eslint for formatting and linting respectively. There are `format` and `lint` scripts set up.