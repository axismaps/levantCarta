const API = '/data/change-sets.json';
// o change set é a reunião das ultimas mudanças nao validadas.

export const changeSetsService = {
  createChangeSet,
  getAllChangeSets,
  getChangeSetById
};

async function createChangeSet(changeSet) {
  try {
    console.log('creating new changeSet', changeSet);
  } catch (error) {
    return Promise.reject(error);
  }
}
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
