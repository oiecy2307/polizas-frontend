/*
 *
 * App reducer
 *
 */
import produce from 'immer';
import { SET_LOADING_STATE, OPEN_SNACKBAR, CLOSE_SNACKBAR } from './constants';

export const initialState = {
  loading: false,
  snackbar: {
    open: false,
    text: '',
    severity: 'success',
  },
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_LOADING_STATE:
        draft.loading = action.isLoading;
        break;
      case OPEN_SNACKBAR:
        draft.snackbar = {
          open: true,
          text: action.text,
          severity: action.severity,
        };
        break;
      case CLOSE_SNACKBAR:
        draft.snackbar = {
          open: false,
          text: '',
        };
        break;
    }
  });

export default appReducer;
