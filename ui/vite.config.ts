import { loadEnv, defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { urbitPlugin } from '@urbit/vite-plugin-urbit';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));
  const SHIP_URL = process.env.SHIP_URL || process.env.VITE_SHIP_URL || 'http://localhost:8080';
  console.log(SHIP_URL);

  return defineConfig({
    plugins: [
      urbitPlugin({ base: 'astrolabe', target: SHIP_URL, secure: false }),
      svelte(),
    ],
    resolve: {
      alias: {
        '~': path.resolve('./src'),
        '@': path.resolve('./src/components'),
        lib: path.resolve('./src/lib'),
        stores: path.resolve('./src/stores'),
        assets: path.resolve('./src/assets'),
        actions: path.resolve('./src/actions'),
        types: path.resolve('./src/types'),
      },
    },
    server: {
      fs: {
        strict: false,
      },
    },
  });
};
