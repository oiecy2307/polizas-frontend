import { get, getToken, patch } from 'utils/http';

export const wsGetUsersByType = async type => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/users/type/${type}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetTechnicalsActivity = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/users/technicals-activity`,
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
