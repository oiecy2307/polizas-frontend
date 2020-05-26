/*
 *
 * MainLayout actions
 *
 */

import { DEFAULT_ACTION, RELOAD_USER_INFO } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function aReloadUserInfo() {
  return {
    type: RELOAD_USER_INFO,
  };
}
