import nc from 'next-connect';
import Category from '../../../models/Category';
import db from '../../../utils/db';

const handler = nc();

/*
handler.get(async (req, res) => {
  await db.connect();
  const categories = await Product.find().distinct('category');
  await db.disconnect();
  res.send(categories);
});
*/

handler.get(async (req, res) => {
  await db.connect();
  //const categories = await Category.find({}).distinct('name');
  const categories = await Category.find({});
  await db.disconnect();
  res.send(categories);
});

export default handler;
