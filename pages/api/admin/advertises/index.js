import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Advertise from '../../../../models/Advertise';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const advertises = await Advertise.find({});
  await db.disconnect();
  res.send(advertises);
});

handler.post(async (req, res) => {
  await db.connect();
  const newAdvertise = new Advertise({
    advertiseName: '새 광고이름',
    user: 'admin',
    linkUrl: 'https://www.bing.com/',
    imagePath: 'sample picture1',
  });

  const advertise = await newAdvertise.save();
  await db.disconnect();
  res.send({ message: '새 광고가 창조되였습니다.', advertise });
});

export default handler;
