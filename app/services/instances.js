import { getToken, patch, get } from 'utils/http';

export const wsUpdateInstanceSettings = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/instances/settings`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetTicketCosts = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/instances/costs`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
