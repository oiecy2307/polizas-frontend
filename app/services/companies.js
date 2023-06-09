import { get, getToken, patch, post } from 'utils/http';

export const wsGetCompanies = async (status, offset, limit, text = '') => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/companies?status=${status}&offset=${offset}&limit=${limit}&text=${text}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsCreateCompany = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/companies`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsUpdateCompany = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/companies`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsAssignOrSendInvitation = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/companies/send-invitation`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetCompanyById = async id => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/companies/by-id/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
