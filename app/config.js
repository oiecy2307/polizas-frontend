import dev from './config.dev';
import local from './config.local';

const config = (() => {
  switch (process.env.NODE_ENV) {
    case 'local':
      return local;
    case 'development':
      return dev;
    default:
      return dev;
  }
})();

export default config;
