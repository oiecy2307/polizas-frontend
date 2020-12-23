import { get, getToken } from 'utils/http';

export const wsGetDashboardInformation = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/dashboard`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
