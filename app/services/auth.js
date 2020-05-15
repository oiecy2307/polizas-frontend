import { post, patch } from 'utils/http';

export const wLogin = body =>
  new Promise((resolve, reject) => {
    post({
      url: `/auth/login`,
      body,
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });

export const wRegister = body =>
  new Promise((resolve, reject) => {
    post({
      url: `/auth/signup`,
      body,
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });

export const wsSaveToken = body =>
  new Promise((resolve, reject) => {
    patch({
      url: `/auth/save-notification-token`,
      body,
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });

export const wsLogout = body =>
  new Promise((resolve, reject) => {
    patch({
      url: `/auth/logout`,
      body,
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });

export const wsDecodeInvitation = body =>
  new Promise((resolve, reject) => {
    post({
      url: `/auth/decode-invitation`,
      body,
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });

export const wsRegisterWInvitation = body =>
  new Promise((resolve, reject) => {
    post({
      url: `/auth/register-w-invitation`,
      body,
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
