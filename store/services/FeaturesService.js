import axios from 'axios';
const API = process.env.API;

export const featuresService = {
  getFeaturesByLayerId,
  post,
  update,
  delete: _delete
};

async function getFeaturesByLayerId(layerId) {
  try {
    const { data: featureCollection } = await axios.get(
      `${API}/feature/${layerId}`,
      { withCredentials: true }
    );
    return featureCollection;
  } catch (error) {
    return Promise.reject(error);
  }
}
async function post(id, feature) {
  try {
    return await axios.post(`${API}/feature/${id}`, feature, {
      withCredentials: true
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

async function update(id, feature) {
  try {
    return await axios.patch(`${API}/feature/${id}`, feature, {
      withCredentials: true
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
async function _delete() {}
