import { get, getToken, patch, post, deleteRequest } from 'utils/http';

export const wsGetPolizas = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/polizas`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsUpdatePoliza = async (id, body) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/polizas/${id}`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsCreatePoliza = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/polizas`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsDeletePoliza = async id => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    deleteRequest({
      url: `/polizas/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
