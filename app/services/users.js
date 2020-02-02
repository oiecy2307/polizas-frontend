import { get /* , getToken */ } from 'utils/http';

export const wsGetUsersByType = type =>
  // const token = getToken();
  new Promise((resolve, reject) => {
    get({
      url: `/users/type/${type}`,
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
