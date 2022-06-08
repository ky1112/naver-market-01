import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    //slug: { type: String, required: true, unique: true },
    tags: [
      {
        tagName: { type: String, required: false },
      },
    ],
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
