import mongoose from 'mongoose';
require('./User');

const monitorSchema = new mongoose.Schema(
  {
    //user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user: { type: String, required: true },
    ip: { type: String, required: true },
    token: { type: String },
    accessUrl: { type: String },
    isConnected: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Monitor =
  mongoose.models.Monitor || mongoose.model('Monitor', monitorSchema);
export default Monitor;
