import { post } from 'utils/http';

export const wLogin = body =>
  // const token = getToken();
  new Promise((resolve, reject) => {
    post({
      url: `/auth/login`,
      body,
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
