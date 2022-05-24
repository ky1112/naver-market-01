import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ userid: req.body.userid });

  /*
  const clientIp =
    (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
    req.socket.remoteAddress;
  */

  await db.disconnect();
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      userid: user.userid,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).send({ message: '아이디와 암호가 일치하지 않습니다.' });
  }
});

export default handler;
