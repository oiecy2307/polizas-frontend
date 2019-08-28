import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the mainLayout state domain
 */

const selectMainLayoutDomain = state => state.mainLayout || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MainLayout
 */

const makeSelectMainLayout = () =>
  createSelector(
    selectMainLayoutDomain,
    substate => substate,
  );

export default makeSelectMainLayout;
export { selectMainLayoutDomain };
