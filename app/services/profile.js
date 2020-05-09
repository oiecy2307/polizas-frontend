import { get, getToken, postFile } from 'utils/http';

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
