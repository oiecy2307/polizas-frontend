import { get, getToken, postFile, patch } from 'utils/http';

export const wsGetUserProfile = async id => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    get({
      url: `/profile/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsUpdateProfileInfo = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/profile`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsChangePassword = async body => {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    patch({
      url: `/profile/change-password`,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const wsUploadImagePicture = async file => {
  const token = await getToken();
  const formData = new FormData();
  formData.set('file', file);
  return new Promise((resolve, reject) => {
    postFile({
      url: `/profile/change-profile-picture`,
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      uploadProgress: () => {},
    })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};
