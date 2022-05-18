import mongoose from 'mongoose';
require('./User');

const accessLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ip: { type: String, required: true },
    sessionID: { type: String },
    isConnected: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const AccessLog =
  mongoose.models.AccessLog || mongoose.model('AccessLog', accessLogSchema);
export default AccessLog;
