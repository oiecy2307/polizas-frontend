import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the dashboardBackoffice state domain
 */

const selectDashboardBackofficeDomain = state =>
  state.dashboardBackoffice || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DashboardBackoffice
 */

const makeSelectDashboardBackoffice = () =>
  createSelector(
    selectDashboardBackofficeDomain,
    substate => substate,
  );

export default makeSelectDashboardBackoffice;
export { selectDashboardBackofficeDomain };
