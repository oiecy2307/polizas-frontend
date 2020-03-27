import { post, getToken, get } from 'utils/http';
import { getCurrentUser } from 'utils/helper';

export const wsGetNotificationsCount = async () => {
  const token = await getToken();
  const user = await getCurrentUser();
  return new Promise((resolve, reject) => {
    get({
      url: `/notifications/count-unseen-by-user/${user.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetNotifications = async () => {
  const token = await getToken();
  const user = await getCurrentUser();
  return new Promise((resolve, reject) => {
    get({
      url: `/notifications/by-user/${user.id}`,
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
  const user = await getCurrentUser();
  return new Promise((resolve, reject) => {
    post({
      url: `/notifications/mark-as-seen/${user.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
