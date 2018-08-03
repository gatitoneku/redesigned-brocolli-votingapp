function search(query, cb) {
    return fetch('/api').then(checkStatus).then(parseJSON).then(cb);
}

function getPoll(pollid, cb) {
    console.log(pollid);
    return fetch(`/api/poll/${pollid}`).then(checkStatus).then(parseJSON).then(cb);
}

function checkStatus(res) {
    if (res.status >= 200 && res.status < 300) {
        return res;
      }
      const error = new Error(`HTTP Error ${res.statusText}`);
      error.status = res.statusText;
      error.response = res;
      console.log(error);
      throw error;
}

function parseJSON(res) {
    return res.json();
}

const Client = { search, getPoll };
export default Client;