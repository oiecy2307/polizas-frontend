import { post, getToken } from 'utils/http';

export const wsCreateTicket = body => {
  const token = getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/tickets`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
