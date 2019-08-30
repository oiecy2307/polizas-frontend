import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the invoices state domain
 */

const selectInvoicesDomain = state => state.invoices || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Invoices
 */

const makeSelectInvoices = () =>
  createSelector(
    selectInvoicesDomain,
    substate => substate,
  );

export default makeSelectInvoices;
export { selectInvoicesDomain };
