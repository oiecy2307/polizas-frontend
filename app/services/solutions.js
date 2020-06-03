import { get, getToken, patch, post } from 'utils/http';

export const wsGetSolutions = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/solutions`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsCreateSolution = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/solutions`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsUpdateSolution = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/solutions`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
