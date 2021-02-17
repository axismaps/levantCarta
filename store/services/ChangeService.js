import uuidv4 from 'uuid/v4';
export const changeService = {
  createChange,
  deleteChange,
  getChangeById,
  getUnsubmittedChanges,
  patchChange
};

async function createChange(change) {
  try {
    change = {
      id: uuidv4(),
      createAt: '2016-05-03',
      layer: 'Roads',
      approvedStatus: false,
      isSubmitted: false,
      submittedBy: 'User',
      comments: [],
      ...change
    };

    let changes = localStorage.getItem('changes');

    if (changes) {
      changes = JSON.parse(changes);
      changes.push(change);
      localStorage.setItem('changes', JSON.stringify(changes));
    } else {
      localStorage.setItem('changes', JSON.stringify([change]));
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteChange(id) {
  try {
  } catch (error) {}
}

async function getChangeById(id) {
  try {
    let changes = localStorage.getItem('changes');
    if (!changes) {
      return null;
    }
    changes = JSON.parse(changes);
    console.log(changes.filter(change => change.id === id)[0]);
    return changes.filter(change => change.id === id)[0];
  } catch (error) {}
}

async function getUnsubmittedChanges() {
  try {
    let changes = localStorage.getItem('changes');
    if (!changes) {
      return [];
    }
    changes = JSON.parse(changes);
    return changes.filter(change => change.isSubmitted === false);
  } catch (error) {}
}

async function patchChange(change) {
  try {
    let changes = localStorage.getItem('changes');
    if (!changes) {
      return [];
    }
    changes = JSON.parse(changes);
    console.log('changes', changes);

    changes = changes.filter(i => i.id !== change.id);
    console.log('changes sem a change', changes);

    changes.push(change);
    console.log('changes com a change', changes);

    localStorage.setItem('changes', JSON.stringify([change]));
  } catch (error) {
    return promise.reject(error);
  }
}
