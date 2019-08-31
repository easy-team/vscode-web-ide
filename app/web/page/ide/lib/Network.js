export default {
  async post(url, data) {
    return fetch(url, {
      method:'POST',
      credentials: 'same-origin',
      headers:{
        'Content-Type': 'application/json',
        'x-csrf-token':  window.__INITIAL_STATE__.csrf
      },
      body: JSON.stringify(data)
    }).then(response => {
      return response.json();
    });
  }
}