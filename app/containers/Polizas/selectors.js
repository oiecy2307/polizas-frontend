import { createSelector } from 'reselect';

/**
 * Direct selector to the users state domain
 */

const selectPolizasDomain = state => state.polizas;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Users
 */

const makeSelectPolizas = () =>
  createSelector(
    selectPolizasDomain,
    substate => substate,
  );

export default makeSelectPolizas;
export { selectPolizasDomain };
