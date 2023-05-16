import { get, getToken } from 'utils/http';

export const wsGetInventario = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/inventario`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
