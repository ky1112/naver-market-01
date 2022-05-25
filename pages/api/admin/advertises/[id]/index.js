import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Advertise from '../../../../../models/Advertise';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const advertise = await Advertise.findById(req.query.id);
  await db.disconnect();
  res.send(advertise);
});

handler.put(async (req, res) => {
  await db.connect();
  const advertise = await Advertise.findById(req.query.id);
  if (advertise) {
    console.log(req.body);
    advertise.advertiseName = req.body.advertiseName;
    advertise.linkUrl = req.body.linkUrl;
    advertise.imagePath = req.body.imagePath;
    advertise.status = req.body.advertiseStatus;
    advertise.user = 'admin';

    await advertise.save();
    await db.disconnect();
    res.send({ message: '업데이트되였습니다.' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: '해당광고를 찾을수 없습니다.' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const advertise = await Advertise.findById(req.query.id);
  if (advertise) {
    await advertise.remove();
    await db.disconnect();
    res.send({ message: '광고가 삭제되였습니다.' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: '광고를 찾을수 없습니다.' });
  }
});

export default handler;
