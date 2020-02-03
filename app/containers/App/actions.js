import { SET_LOADING_STATE, OPEN_SNACKBAR, CLOSE_SNACKBAR } from './constants';

export function setLoadingState(isLoading) {
  return {
    type: SET_LOADING_STATE,
    isLoading,
  };
}

export function openSnackbar(text, severity) {
  return {
    type: OPEN_SNACKBAR,
    text,
    severity,
  };
}

export function closeSnackbar() {
  return {
    type: CLOSE_SNACKBAR,
  };
}
