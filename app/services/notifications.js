import { post, getToken, get } from 'utils/http';

export const wsGetNotificationsCount = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/notifications/count-unseen-by-user`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetNotifications = async offset => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/notifications/by-user?offset=${offset}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsMarkNotificationsAsSeen = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/notifications/mark-as-seen`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
