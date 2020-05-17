const express = require('express');
const path = require('path');
const { createBundleRenderer } = require('vue-server-renderer');

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const clientConfig = require('../../webpack.client.config');
const serverConfig = require('../../webpack.server.config');

const newSSRHandler = (renderer) => (async (req, res) => {
  console.log("rendering");
  const context = {
    url: req.params['0'] || '/',
    title: 'Vue SSR Simple Setup',
  };
  let html;

  try {
    html = await renderer.renderToString(context);
  } catch (error) {
    if (error.code === 404) {
      return res.status(404).send('404 | Page Not Found');
    }
    return res.status(500).send('500 | Internal Server Error');
  }

  res.end(html);
});


const compiler = Webpack([clientConfig, serverConfig]);

const devServerOptions = {
  contentBase: path.join(__dirname, 'dist'),
  stats: {
    colors: true,
  },
};
const server = new WebpackDevServer(compiler, devServerOptions);
const port = 3000;
server.listen(port, () => console.log(`Listening on: ${port}`));

compiler.plugin('done', function (stats) {
  console.log("start loading");
  const fs = server.middleware.fileSystem;
  const clientManifest = JSON.parse(fs.readFileSync(
    path.join(clientConfig.output.path, 'vue-ssr-client-manifest.json'),
    'utf-8'
  ))
  console.log("loading is done 1");

  const serverBundle = JSON.parse(
    fs.readFileSync(path.join(clientConfig.output.path, 'vue-ssr-server-bundle.json'), 'utf-8')
  );

  console.log("loading is done 2");

  try {
    const renderer = createBundleRenderer(serverBundle, {
      clientManifest,
      runInNewContext: false,
      template: require('fs').readFileSync(path.resolve(__dirname, '../../index.html'), 'utf-8'),
    });
    server.app.get('*', newSSRHandler(renderer));
  } catch (err) {
    console.log("loading err: ", err);
  }
console.log("loading is done");
  console.log(`started: Browse to http://localhost:${port}/webpack-dev-server/`)
});

