const API = '/data/change-sets.json';
import uuidv4 from 'uuid/v4';

// o change set é a reunião das ultimas mudanças nao validadas.

export const changeSetsService = {
  createChangeSet,
  getAllChangeSets,
  getChangeSetById
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

    let changeSets = localStorage.getItem('changeSets');

    if (changeSets) {
      changeSets = JSON.parse(changeSets);
      changeSets.push(changeSet);
      localStorage.setItem('changeSets', JSON.stringify(changeSets));
    } else {
      localStorage.setItem('changeSets', JSON.stringify([changeSet]));
    }
    return changeSets;
  } catch (error) {
    return Promise.reject(error);
  }
}
async function getAllChangeSets() {
  try {
    let changeSets = localStorage.getItem('changeSets');

    if (changeSets) {
      changeSets = JSON.parse(changeSets);
      return changeSets;
    } else {
      return [];
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getChangeSetById(id) {
  try {
    let changeSets = localStorage.getItem('changeSets');
    if (!changeSets) {
      return null;
    }
    changeSets = JSON.parse(changeSets);
    return changeSets.filter(changeSet => changeSet.id === id)[0];
  } catch (error) {
    return Promise.reject(error);
  }
}

function delay(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 1000);
  });
}
