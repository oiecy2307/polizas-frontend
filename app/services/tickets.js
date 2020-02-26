import { post, getToken, get } from 'utils/http';

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

export const wsGetTicketsByStatus = (status, date) => {
  const token = getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/tickets?status=${status}&date=${date}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetDatesWithTickets = (month, year) => {
  const token = getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/tickets/by-month/${month}/${year}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
