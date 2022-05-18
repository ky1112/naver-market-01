import axios from 'axios';

async function updateCurrentAction(data) {
  await axios.post('/api/common/updateAction', {
    token: data.token,
    email: data.useremail,
    accessUrl: data.accessUrl,
    isConnected: data.isConnected,
  });
}

export { updateCurrentAction };
