import nc from 'next-connect';
import Monitor from '../../../../../models/Monitor';
import { isAuth } from '../../../../../utils/auth';
import db from '../../../../../utils/db';
import { onError } from '../../../../../utils/error';

const handler = nc({
  onError,
});
handler.use(isAuth);

handler.delete(async (req, res) => {
  await db.connect();
  const row = await Monitor.findById(req.query.id);
  if (row) {
    await row.remove();
    await db.disconnect();
    res.send({ message: '기록이 삭제되였습니다.' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: '삭제할 기록을 찾을수 업습니다.' });
  }
});

export default handler;
