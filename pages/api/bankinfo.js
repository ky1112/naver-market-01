import nc from 'next-connect';
import BankInfo from '../../models/BankInfo';
import db from '../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  //const advertise = await Advertise.findById(req.query.id);
  const bankInfo = await BankInfo.findOne({});
  await db.disconnect();
  res.send(bankInfo);
});

export default handler;
