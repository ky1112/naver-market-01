import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Category from '../../../../models/Category';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const categories = await Category.find({});
  await db.disconnect();
  res.send(categories);
});

handler.post(async (req, res) => {
  await db.connect();
  const newCategory = new Category({
    name: 'sample category',
    slug: 'sample-slug-' + Math.random(),
    tags: [
      {
        tagName: 'tag1',
      },
      {
        tagName: 'tag2',
      },
    ],
  });

  const category = await newCategory.save();
  await db.disconnect();
  res.send({ message: 'Category Created', category });
});

export default handler;
