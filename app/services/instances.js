import { getToken, patch } from 'utils/http';

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
