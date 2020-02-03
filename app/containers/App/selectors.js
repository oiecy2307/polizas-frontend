import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectRouter = state => state.router;
const selectGlobal = state => state.appPage || initialState;

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState.location,
  );

const makeSelectApp = () =>
  createSelector(
    selectGlobal,
    globalState => globalState,
  );

export { makeSelectLocation, makeSelectApp };
