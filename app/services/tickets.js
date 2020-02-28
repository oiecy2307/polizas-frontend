import { post, getToken, get } from 'utils/http';

export const wsCreateTicket = async body => {
  const token = await getToken();
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

export const wsGetTicketsByStatus = async (status, date) => {
  const token = await getToken();
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

export const wsGetDatesWithTickets = async (month, year) => {
  const token = await getToken();
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
