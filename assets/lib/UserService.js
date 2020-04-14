const API = '...';

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
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  };

  try {
    // const user = await handleResponse(
    //   fetch(`${API}/users/authenticate`, requestOptions)
    // );

    const user = await mockLogin(requestOptions);

    if (user.token) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
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
  return response.text().then(text => {
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

function mockLogin(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = {
        name: 'Davi',
        token: 'fake-token'
      };
      resolve(user);
      // reject('error');
    }, 1200);
  });
}
