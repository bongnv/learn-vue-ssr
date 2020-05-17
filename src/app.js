import Vue from 'vue';
import Meta from 'vue-meta'
import App from './App.vue';
import { createRouter } from './router';

Vue.use(Meta, {
    ssrAppId: 1 // https://vue-meta.nuxtjs.org/guide/caveats.html#duplicated-tags-after-hydration-with-ssr
});

export const createApp = (context) =>  {
    const router = createRouter();

    const app = new Vue({
        router,
        render: h => h(App),
    });
    
    return {app, router};
};
