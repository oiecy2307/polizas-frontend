import {
  post,
  getToken,
  get,
  patch,
  postFile,
  deleteRequest,
} from 'utils/http';

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

export const wsGetTicketsByStatus = async (
  status,
  date,
  clientId,
  technicalId,
) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    const technicalFilter = technicalId ? `&technicalId=${technicalId}` : '';
    const url = clientId
      ? `/tickets?status=${status}&date=${date}&clientId=${clientId}`
      : `/tickets?status=${status}&date=${date}${technicalFilter}`;
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

export const wsGetTicketsBrief = async (
  status,
  date,
  clientId,
  technicalId,
) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    const technicalFilter = technicalId ? `&technicalId=${technicalId}` : '';
    const url = clientId
      ? `/tickets/day-brief?status=${status}&date=${date}&clientId=${clientId}`
      : `/tickets/day-brief?status=${status}&date=${date}${technicalFilter}`;
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

export const wsGetDatesWithTickets = async (
  month,
  year,
  clientId,
  technicalId,
) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    const technicalFilter = technicalId ? `?technicalId=${technicalId}` : '';
    const url = clientId
      ? `/tickets/by-month/${month}/${year}?clientId=${clientId}`
      : `/tickets/by-month/${month}/${year}${technicalFilter}`;
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

export const wsCloseTicket = async (id, body) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/tickets/close/${id}`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsPayTicket = async (id, body) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/tickets/pay/${id}`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsAssignTicket = async (id, body) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/tickets/assign-ticket/${id}`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsUploadEvidence = async (file, uploadProgress) => {
  const token = await getToken();
  const formData = new FormData();
  formData.set('file', file);
  return new Promise((resolve, reject) => {
    postFile({
      url: `/tickets/upload-evidence`,
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      uploadProgress,
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetTicketById = async id => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    const url = `/tickets/by-id/${id}`;
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

export const wsUpdateTicket = async (id, body) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/tickets/by-id/${id}`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsUpdateStatusTicket = async (id, body) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/tickets/change-status/${id}`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetTicketComments = async id => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/tickets/${id}/comments`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsCreateComment = async (id, body) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/tickets/${id}/comments`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsDeleteComment = async id => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    deleteRequest({
      url: `/tickets/comments/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetReport = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/tickets/get-report`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsGetReportFilters = async () => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/tickets/get-report-filters`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsCreateTimeTracker = async (body, id) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    post({
      url: `/tickets/play-time/${id}`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsPauseTimeTracker = async (body, id) => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/tickets/pause-time/${id}`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
