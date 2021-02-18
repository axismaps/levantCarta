import axios from 'axios';

const API = process.env.API;

import uuidv4 from 'uuid/v4';

export const changeSetsService = {
  createChangeSet,
  getAllChangeSets,
  getChangeSetById,
  updateChangeSet
};

async function createChangeSet(changeSet) {
  try {
    changeSet = {
      id: uuidv4(),
      createAt: '2016-05-03',
      type: 'roads',
      approvedStatus: false,
      submittedBy: 'User',
      ...changeSet
    };

    const response = await axios.post(`${API}/changeset`, changeSet, {
      withCredentials: true
    });
    console.log(response);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
async function getAllChangeSets() {
  try {
    const {
      data: { response }
    } = await axios.get(`${API}/changeset`, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

async function updateChangeSet(id, changes) {
  try {
    const response = await axios.patch(
      `${API}/changeset/${id}`,
      {
        changes: changes
      },
      {
        withCredentials: true
      }
    );
    console.log('response', response);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

async function getChangeSetById(id) {
  try {
    const {
      data: { response }
    } = await axios.get(`${API}/changeset/${id}`, {
      withCredentials: true
    });
    return response[0];
  } catch (error) {
    return Promise.reject(error);
  }
}
