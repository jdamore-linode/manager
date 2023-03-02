import baseConfig from '../vite.config';
import { mergeConfig, defineConfig } from 'vite';

export default mergeConfig(
  baseConfig,
  defineConfig({
    resolve: {
      alias: {
        src: `${__dirname}/../src`,
        '@src': `${__dirname}/../src`,
        support: `${__dirname}/support`,
      },
    },
  })
);
