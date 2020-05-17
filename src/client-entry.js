import { createApp } from './app';
import './assets/styles/base.css';

const { app, router } = createApp();

router.onReady(() => {
    app.$mount('#app');
});
