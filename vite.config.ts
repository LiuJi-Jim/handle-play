import { defineConfig } from 'vite';
import { resolve } from 'path';
import Vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/handle-play/',
  worker: {
    format: 'es',
  },
  plugins: [
    Vue(),
    Icons({ compiler: 'vue3' }),
    Components({
      dts: true,
      resolvers: [
        IconsResolver({
          prefix: '',
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, 'src')}/`,
    },
  },
});
