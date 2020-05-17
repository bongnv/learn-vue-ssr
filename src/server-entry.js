import { createApp } from './app';

export default context => {
  // since there could potentially be asynchronous route hooks or 
  // components, we will be returning a Promise so that the server can
  // wait until everything is ready before rendering.
  return new Promise((resolve, reject) => {
    const { app, router } = createApp(context);
    // metadata is provided by vue-meta plugin
    const meta = app.$meta();

    // set server-side router's location
    router.push(context.url);

    context.meta = meta;

    // wait until router has resolved possible async components and 
    // hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // no matched routes, reject with 404
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }
      // This `rendered` hook is called when the app has finished
      // rendering
      context.rendered = () => {
        console.log("Rendered");
      };

      // the Promise should resolve to the app instance so it can
      // be rendered
      resolve(app);
    }, reject);
  })
}
