import nc from 'next-connect';
import Monitor from '../../../../models/Monitor';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';

const handler = nc({
  onError,
});
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Monitor.find({});
  await db.disconnect();
  res.send(orders);
});

export default handler;
