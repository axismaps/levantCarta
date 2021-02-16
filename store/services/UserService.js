import axios from 'axios';
const API = process.env.API;

export const userService = {
  login,
  logout,
  register,
  getAll,
  getById,
  update,
  delete: _delete
};

async function login(username, password) {
  try {
    const response = await axios.post(
      `${API}/login`,
      { email: username, password: password },
      { withCredentials: true }
    );

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}
async function logout() {
  localStorage.removeItem('user');
}

async function register(user) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };

  try {
    const user = await handleResponse(
      fetch(`${API}/users/register`, requestOptions)
    );
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getAll() {}
async function getById() {}
async function update() {}
async function _delete() {}

async function handleResponse(response) {
  return await response.text().then(text => {
    console.log(text);
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
