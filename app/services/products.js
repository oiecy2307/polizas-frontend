import { get, getToken, patch, post } from 'utils/http';

export const wsGetProducts = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/products`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsCreateProduct = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/products`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsUpdateProduct = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/products`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
