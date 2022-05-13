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
    const tag = category.tags.find((x) => x._id == req.body.tagId);
    if (tag) {
      await Category.findOneAndUpdate(
        {
          _id: req.query.id,
        },
        {
          $pull: {
            tags: {
              _id: req.body.tagId,
            },
          },
        }
      );
      await db.disconnect();
      res.status(201).send({
        message: 'Tag removed',
      });
    } else {
      return res.send({ message: 'Not exist tag to remove' });
    }
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Category Not Found' });
  }
});

export default handler;
