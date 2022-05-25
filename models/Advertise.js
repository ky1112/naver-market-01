import mongoose from 'mongoose';

const advertiseSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    advertiseName: { type: String, required: true },
    linkUrl: { type: String, required: false },
    imagePath: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

const Advertise =
  mongoose.models.Advertise || mongoose.model('Advertise', advertiseSchema);

export default Advertise;
