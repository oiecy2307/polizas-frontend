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

export const wsGetTicketsByStatus = async (status, date, clientId) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    const url = clientId
      ? `/tickets?status=${status}&date=${date}&clientId=${clientId}`
      : `/tickets?status=${status}&date=${date}`;
    get({
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetDatesWithTickets = async (month, year, clientId) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    const url = clientId
      ? `/tickets/by-month/${month}/${year}?clientId=${clientId}`
      : `/tickets/by-month/${month}/${year}`;
    get({
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
