import { get, getToken, patch, post } from 'utils/http';

export const wsGetProducts = async (status, offset, limit, text = '') => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/products?status=${status}&offset=${offset}&limit=${limit}&text=${text}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetProductsBrief = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/products/brief`,
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
