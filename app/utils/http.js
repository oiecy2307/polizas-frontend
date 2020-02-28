/* eslint-disable */
import axios from 'axios';
import { BASE_URL } from 'config';
import { ImmortalDB } from 'immortal-db';

import history from 'utils/history';
const apiCall = axios.create({
  baseURL: BASE_URL,
});

apiCall.interceptors.request.use(config => config, function(error) {
  return Promise.reject(error);
});

apiCall.interceptors.response.use(response => response, async function(error) {
  let errorMessage = 'There was an error communicating with the server.';
  if (error.response) {
    if (error.response.status === 401) {
      history.push('/');
    }
    errorMessage = error.response.message
      ? error.response.message
      : errorMessage;
  } else if (error.request) {
    errorMessage = 'Error en comunicación con el servidor';
  } else {
    errorMessage = error.message ? error.message : errorMessage;
  }
  error.response.message = errorMessage;
  return Promise.reject(error.response);
});

export async function getToken() {
  try {
    const token = await ImmortalDB.get('token');

    if (token) {
      return token;
    }
    return '';
  } catch (e) {
    return '';
  }
}

export const post = (data) => {
  return new Promise ((resolve, reject) => {
    if(data.headers) {
      apiCall
      .post(data.url, data.body, {headers: data.headers})
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
    } else {
      apiCall
      .post(data.url, data.body)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
    }
  });
};

export const get = (data) => {
  return new Promise((resolve, reject) => {
    if(data.headers) {
      apiCall
      .get(data.url, {headers: data.headers})
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
    } else {
      apiCall
      .get(data.url)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
    }
  });
};

export const patch = (data) => {
  return new Promise ((resolve, reject) => {
    if(data.headers) {
      apiCall
      .patch(data.url, data.body, {headers: data.headers})
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
    } else {
      apiCall
      .patch(data.url, data.body)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
    }
  });
};

export const deleteRequest = (data) => {
  return new Promise ((resolve, reject) => {
    if(data.headers) {
      apiCall
      .delete(data.url, {headers: data.headers})
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
    } else {
      apiCall
      .delete(data.url)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
    }
  });
};

// export const uploadFile = ({ file, path }) => {
//   return new Promise ((resolve, reject) => {
//     var bodyFormData = new FormData();
//     bodyFormData.set('file', file);
//     bodyFormData.set('path', path);
//     axios({
//       method: 'post',
//       url: config.FILES_API_URL + '/upload',
//       data: bodyFormData,
//       headers: {'Content-Type': 'multipart/form-data' }
//     })
//     .then(function (response) {
//       resolve(response.data);
//     })
//     .catch(function (response) {
//       reject(response);
//     });
//   });
// };
//
// export const downloadFile = ({fileName, path}) => {
//   return new Promise ((resolve, reject) => {
//     var payload = {
//       fileName,
//       directory: path,
//     };
//     axios({
//       method: 'post',
//       url: config.FILES_API_URL + '/retrieve',
//       data: payload,
//       headers: {'Content-Type': 'application/json' }
//     })
//     .then(function (response) {
//       resolve(response.data);
//     })
//     .catch(function (response) {
//       reject(response);
//     });
//   });
// };
