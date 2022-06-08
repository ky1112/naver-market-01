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
  try {
    await db.connect();
    console.log(1);

    const newCategory = new Category({
      name: '새 카테고리',
      //slug: 'sample-slug-' + Math.random(),
      // tags: [
      //   {
      //     tagName: 'tag1',
      //   },
      //   {
      //     tagName: 'tag2',
      //   },
      // ],
    });

    const category = await newCategory.save();
    console.log(2);
    await db.disconnect();
    res.send({ message: 'Category Created', category });
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: '오류발생' });
  }
});

export default handler;
