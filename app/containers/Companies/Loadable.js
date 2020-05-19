/**
 *
 * Asynchronously loads the component for Companies
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
