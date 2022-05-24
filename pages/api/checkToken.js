import nc from 'next-connect';
import { isAuth } from '../../utils/auth';

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  console.log('####################');
  console.log(req);
  res.send({ msg: 'Token is valid' });
});

export default handler;
