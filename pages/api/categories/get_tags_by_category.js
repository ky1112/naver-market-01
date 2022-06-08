import nc from 'next-connect';
import Category from '../../../models/Category';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const categories = await Category.find({ name: req.query.name });
  await db.disconnect();
  res.send(categories);
});

export default handler;
