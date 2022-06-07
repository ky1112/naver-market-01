import nc from 'next-connect';
// import Product from '../../models/Product';
import db from '../../utils/db';
import data from '../../utils/data';
// import User from '../../models/User';
import Category from '../../models/Category';
import Advertise from '../../models/Advertise';
import Product from '../../models/Product';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  // console.log(data.category);
  // await Category.deleteMany();
  // await Category.insertMany(data.category);
  // console.log(data.advertise);
  // await Advertise.deleteMany();
  // await Advertise.insertMany(data.advertise);

  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();

  return res.send({ message: 'already seeded' });
  // await db.connect();
  // await User.deleteMany();
  // await User.insertMany(data.users);
  // await Product.deleteMany();
  // await Product.insertMany(data.products);
  // await db.disconnect();
  // res.send({ message: 'seeded successfully' });
});

export default handler;
