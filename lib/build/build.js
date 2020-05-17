const bundle = require("./bundle");
const path = require("path");
const { createBundleRenderer } = require('vue-server-renderer');
const fs = require('fs');

bundle()
.then((buildResult) => {
  console.log("build done!", buildResult); 
  const serverBundle = require(path.resolve('dist/vue-ssr-server-bundle.json'))
  const clientManifest = require(path.resolve('dist/vue-ssr-client-manifest.json'))
  console.log("clientManifest", clientManifest, serverBundle);

  const renderer = createBundleRenderer(serverBundle, {
    clientManifest,
    runInNewContext: false,
    template: fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf-8'),
  })

  const context = {
    url: "/",
    title: 'VuePress',
    lang: 'en',
    description: '',
  }

  renderer.renderToString(context).then((html) => {
    console.log("html", html);
    fs.writeFile("dist/index.html", html, () => {
      console.log("index.html is written to dist");
    })
  });


})
.catch((err) => {
  console.error(`build error:`, err)
});
