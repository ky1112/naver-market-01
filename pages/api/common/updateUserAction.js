import nc from 'next-connect';
import Monitor from '../../../models/Monitor';
import db from '../../../utils/db';

const handler = nc();
//handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
  var MobileDetect = require('mobile-detect');
  const md = new MobileDetect(req.headers['user-agent']);
  const is_mobile = md.mobile() ? true : false;

  await db.connect();

  //Remove duplicated entries
  const dups = await Monitor.find({
    //user: req.body.email,
    user: req.body.userid,
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
    user: req.body.userid,
    token: req.body.token,
    isConnected: Boolean(true),
  });

  const clientIp =
    (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
    req.socket.remoteAddress;

  try {
    if (monitor_row && monitor_row.length) {
      //console.log(req.body.loginstatus);
      monitor_row[0].user = req.body.userid;
      monitor_row[0].ip = clientIp;
      monitor_row[0].isConnected = Boolean(req.body.loginstatus);
      monitor_row[0].isMobile = Boolean(is_mobile);
      monitor_row[0].accessUrl = req.body.accessUrl;
      monitor_row[0].token = req.body.token;
      await monitor_row[0].save();
      await db.disconnect();
      res.send({ message: 'Row Updated Successfully' });
    } else {
      //console.log(req.body.loginstatus);
      const newMonitorInfo = new Monitor({
        user: req.body.userid,
        ip: clientIp,
        token: req.body.token,
        accessUrl: req.body.accessUrl,
        isConnected: true,
        isMobile: Boolean(is_mobile),
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
