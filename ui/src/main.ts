import App from './App.svelte'

window.desk = window.desk || 'astrolabe';
window.ship = window.ship || 'zod';

const app = new App({
  target: document.getElementById('app'),
})

export default app;
