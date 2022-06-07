import mongoose from 'mongoose';

const bankInfoSchema = new mongoose.Schema(
  {
    salerName: { type: String, required: true },
    salerEmail: { type: String, required: true },
    bankName: { type: String, required: true },
    bankDescription: { type: String, required: true },
    ownerName: { type: String, required: true },
    payValidDate: { type: String, required: true },
    user: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const BankInfo =
  mongoose.models.BankInfo || mongoose.model('BankInfo', bankInfoSchema);
export default BankInfo;
