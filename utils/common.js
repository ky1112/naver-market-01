import axios from 'axios';
import Cookies from 'js-cookie';

async function updateCurrentAction(data) {
  await axios.post('/api/common/updateAction', {
    userid: data.userid,
    token: data.token,
    accessUrl: data.accessUrl,
    loginstatus: data.isConnected,
  });
}

function clearCookies() {
  Cookies.remove('userInfo');
  Cookies.remove('cartItems');
  Cookies.remove('shippinhAddress');
  Cookies.remove('paymentMethod');
}

export { updateCurrentAction, clearCookies };
