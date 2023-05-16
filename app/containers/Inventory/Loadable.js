/**
 *
 * Asynchronously loads the component for Inventario
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
