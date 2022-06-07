import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Category from '../../../../models/Category';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  //console.log(req.query.id);
  const tags = await Category.findOne({ name: req.query.name });
  await db.disconnect();
  res.send(tags);
});

export default handler;
