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
  const rows = await Monitor.find({ isConnected: true });
  await db.disconnect();
  res.send(rows);
});

export default handler;
