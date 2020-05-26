/*
 *
 * MainLayout reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, RELOAD_USER_INFO } from './constants';

export const initialState = {
  reloadUserInfo: false,
};

/* eslint-disable default-case, no-param-reassign */
const mainLayoutReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case RELOAD_USER_INFO:
        draft.reloadUserInfo = !state.reloadUserInfo;
        break;
    }
  });

export default mainLayoutReducer;
