import dev from './config.dev';
import local from './config.local';
import staging from './config.staging';

const config = (() => {
  switch (process.env.NODE_ENV) {
    case 'staging':
      return staging;
    case 'local':
      return local;
    case 'development':
      return dev;
    default:
      return dev;
  }
})();

export default config;
