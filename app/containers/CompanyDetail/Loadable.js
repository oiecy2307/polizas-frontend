/**
 *
 * Asynchronously loads the component for CompanyDetail
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
