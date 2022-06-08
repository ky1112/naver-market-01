import nc from 'next-connect';
import Category from '../../../models/Category';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  //const categories = await Category.find({}).distinct('name');
  var ObjectId = require('mongoose').Types.ObjectId;
  const categories = await Category.find({
    'tags._id': ObjectId(req.query.id),
  });
  await db.disconnect();
  res.send(categories);
});

export default handler;
