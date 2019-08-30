/**
 *
 * Asynchronously loads the component for Invoices
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
