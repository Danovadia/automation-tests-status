/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const logger = require('./logger');
const _ = require("lodash");

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// tests data logic - if extending please take out of index.js
const fs = require("fs");
const filewatcher = require('filewatcher');
const path = require("path");
// const dataFolderPath = path.join(__dirname, "../data")
const dataFolderPath = "/home/user/workspace"
const dataParser = require("../utils/dataParser");

let tests = [];

require.extensions['.properties'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const watcher = filewatcher();
watcher.add(dataFolderPath);
watcher.on('change', function(file, stat) {
  console.log('Tests modified: %s', file);
  for (const key in require.cache) {
    if (key.endsWith(".properties")) {
      delete require.cache[key]
    }
  }
  requireTests();
});

const requireTests = () => {
  tests = [];
  
  let files = fs.readdirSync(dataFolderPath);
  files.forEach((item) => {
	if (item.endsWith('stats.properties')) {
    		let fileFullPath = path.join(dataFolderPath, item);
    		let dataFile = require(fileFullPath);
    		let parsedData = dataParser(dataFile);
        parsedData.name = item.replace('.properties', '').replace(/_/g, ' ');
    		tests.push(parsedData);
	}
	});
}

requireTests()

app.get('/data', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  return res.send(tests)
});
// end of data parsing and routing


// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
