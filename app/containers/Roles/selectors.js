import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the roles state domain
 */

const selectRolesDomain = state => state.roles || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Roles
 */

const makeSelectRoles = () =>
  createSelector(
    selectRolesDomain,
    substate => substate,
  );

export default makeSelectRoles;
export { selectRolesDomain };
