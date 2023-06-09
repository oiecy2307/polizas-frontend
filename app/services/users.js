import { get, getToken, patch, post, deleteRequest } from 'utils/http';

export const wsGetUsers = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/users`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsUpdateUser = async (id, body) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/users/${id}`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wCreateUser = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/users`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsDeleteUser = async id => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    deleteRequest({
      url: `/users/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
