const API = '/data/change-sets.json';

export const changeSetsService = {
  getAllChangeSets,
  getChangeById,
  getChangeSetById,
  patchChange
};

async function getAllChangeSets() {
  try {
    console.log('getting all change sets');

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const changeSets = await fetch('/data/change-sets.json', requestOptions);
    return changeSets.json();
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getChangeById(id) {
  try {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    const res = await fetch('/data/change.json', requestOptions);
    return res.json();
  } catch (error) {}
}

async function getChangeSetById(id) {
  try {
    console.log('getting change set by id', id);
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const res = await fetch('/data/change-set.json', requestOptions);

    return res.json();
  } catch (error) {
    return Promise.reject(error);
  }
}

async function patchChange(change) {
  try {
    console.log('patch', change);
  } catch (error) {
    return promise.reject(error);
  }
}
