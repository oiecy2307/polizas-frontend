/**
 *
 * Asynchronously loads the component for Solutions
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
