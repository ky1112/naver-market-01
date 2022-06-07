import nc from 'next-connect';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

const handler = nc({
  onError,
});
//handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  try {
    const newOrder = new Order({
      ...req.body,
    });
    const order = await newOrder.save();
    res.status(201).send(order);
  } catch (err) {
    console.log(err);
  }
});

export default handler;
