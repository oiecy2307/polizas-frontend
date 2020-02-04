import { post } from 'utils/http';

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
