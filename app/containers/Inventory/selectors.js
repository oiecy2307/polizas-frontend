import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the users state domain
 */

const selecInventarioDomain = state => state.inventario || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Users
 */

const makeSelectInventario = () =>
  createSelector(
    selecInventarioDomain,
    substate => substate,
  );

export default makeSelectInventario;
export { selecInventarioDomain };
