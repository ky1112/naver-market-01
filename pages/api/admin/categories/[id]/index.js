import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Category from '../../../../../models/Category';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const category = await Category.findById(req.query.id);
  await db.disconnect();
  res.send(category);
});

handler.put(async (req, res) => {
  await db.connect();
  const category = await Category.findById(req.query.id);
  if (category) {
    category.name = req.body.name;
    category.slug = req.body.slug;
    category.user = req.body.username;

    await category.save();
    await db.disconnect();
    res.send({ message: 'Category Updated Successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Category Not Found' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const category = await Category.findById(req.query.id);
  if (category) {
    await category.remove();
    await db.disconnect();
    res.send({ message: 'Category Deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Category Not Found' });
  }
});

export default handler;
