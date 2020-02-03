export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user;
  } catch (e) {
    return null;
  }
};

export const getToken = () => {
  try {
    const token = localStorage.getItem('token');
    return token;
  } catch (e) {
    return null;
  }
};
