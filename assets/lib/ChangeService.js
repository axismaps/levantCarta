export const changeService = {
  createChange,
  deleteChange,
  getChangeById,
  patchChange
};

async function createChange(change) {
  try {
    const requestOptions = {
      method: 'CREATE',
      headers: { 'Content-Type': 'application/json' }
    };
    const res = await fetch('/data/change.json', requestOptions);
    return res.json();
  } catch (error) {}
}

async function deleteChange(id) {
  try {
  } catch (error) {}
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

async function patchChange(change) {
  try {
    console.log('patch', change);
  } catch (error) {
    return promise.reject(error);
  }
}
