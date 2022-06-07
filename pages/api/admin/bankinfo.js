import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../utils/auth';
import BankInfo from '../../../models/BankInfo';
import db from '../../../utils/db';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  //const advertise = await Advertise.findById(req.query.id);
  const bankInfo = await BankInfo.findOne({});
  await db.disconnect();
  res.send(bankInfo);
});

handler.put(async (req, res) => {
  await db.connect();
  const binfo = await BankInfo.findOne({});
  if (binfo) {
    //console.log(req.body);
    binfo.salerName = req.body.salerName;
    binfo.salerEmail = req.body.salerEmail;
    binfo.bankName = req.body.bankName;
    binfo.bankDescription = req.body.bankDescription;
    binfo.ownerName = req.body.ownerName;
    binfo.payValidDate = req.body.payValidDate;
    binfo.user = 'admin';

    await binfo.save();
    await db.disconnect();
    res.send({ message: '업데이트되였습니다.' });
  } else {
    const newBankInfo = new BankInfo({
      salerName: req.body.salerName,
      salerEmail: req.body.salerEmail,
      bankName: req.body.bankName,
      bankDescription: req.body.bankDescription,
      ownerName: req.body.ownerName,
      payValidDate: req.body.payValidDate,
    });
    const bankinfo = await newBankInfo.save();
    await db.disconnect();
    res.send({ message: '계좌정보가 창조되였습니다.', bankinfo });
    //res.status(404).send({ message: '해당광고를 찾을수 없습니다.' });
  }
});

export default handler;
