//import mongoose from 'mongoose';
import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error';
import db from '../../../../utils/db';
import Category from '../../../../models/Category';
import { isAuth } from '../../../../utils/auth';

const handler = nextConnect({
  onError,
});

handler.use(isAuth).post(async (req, res) => {
  await db.connect();
  const category = await Category.findById(req.query.id);

  if (category) {
    const tag = category.tags.find((x) => x.tagName == req.body.tagName);
    if (tag) {
      await db.disconnect();
      return res.send({ message: 'Tag already exist' });
    } else {
      const tagItem = {
        tagName: req.body.tagName,
      };
      category.tags.push(tagItem);
      await category.save();
      await db.disconnect();
      res.status(201).send({
        message: 'Tag added',
      });
    }
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Category Not Found' });
  }
});

export default handler;
