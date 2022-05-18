import nc from 'next-connect';
import Monitor from '../../../models/Monitor';
import db from '../../../utils/db';

const handler = nc();
//handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
  await db.connect();
  //const user = await User.findById(req.query.id);

  //Remove duplicated entries
  const dups = await Monitor.find({
    user: req.body.email,
    token: { $ne: req.body.token },
    isConnected: Boolean(true),
  });

  if (dups && dups.length) {
    for (var i = 0; i < dups.length; i++) {
      dups[i].isConnected = Boolean(false);
      await dups[i].save();
    }
  }

  const monitor_row = await Monitor.find({
    user: req.body.email,
    token: req.body.token,
    isConnected: Boolean(true),
  });

  const clientIp =
    (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
    req.socket.remoteAddress;

  try {
    if (monitor_row && monitor_row.length) {
      monitor_row[0].user = req.body.email;
      monitor_row[0].ip = clientIp;
      monitor_row[0].isConnected = Boolean(req.body.loginstatus);
      monitor_row[0].accessUrl = req.body.accessUrl;
      monitor_row[0].token = req.body.token;
      await monitor_row[0].save();
      await db.disconnect();
      res.send({ message: 'Row Updated Successfully' });
    } else {
      const newMonitorInfo = new Monitor({
        user: req.body.email,
        ip: clientIp,
        token: req.body.token,
        accessUrl: req.body.accessUrl,
        isConnected: true,
      });
      await newMonitorInfo.save();
      await db.disconnect();
      res.send({ message: 'Row Added Successfully' });
    }
  } catch (err) {
    console.log(err);
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const user = await Monitor.findById(req.query.id);
  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({ message: 'User Deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User Not Found' });
  }
});

export default handler;
