import uuidv4 from 'uuid/v4';
export const changeService = {
  getChangeById
};

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
