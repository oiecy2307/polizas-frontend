import { get, getToken, patch, post, deleteRequest } from 'utils/http';

export const wsGetUsersByType = async (type, offset, limit, filter) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/users/type/${type}?offset=${offset}&limit=${limit}&text=${filter}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetAllClients = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/users/all-clients`,
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

export const wsGetInvitations = async (status, offset, limit, text = '') => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/users/invitations?status=${status}&offset=${offset}&limit=${limit}&text=${text}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsSendInvitation = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/users/send-invitation`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetInvitationToken = async id => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/users/token/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsCancelInvitation = async id => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    deleteRequest({
      url: `/users/invitation/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetUsersSettings = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/users/settings`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsUpdateUsersSettings = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/users/settings/update`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
