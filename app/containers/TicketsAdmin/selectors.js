import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ticketsAdmin state domain
 */

const selectTicketsAdminDomain = state => state.ticketsAdmin || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by TicketsAdmin
 */

const makeSelectTicketsAdmin = () =>
  createSelector(
    selectTicketsAdminDomain,
    substate => substate,
  );

export default makeSelectTicketsAdmin;
export { selectTicketsAdminDomain };
