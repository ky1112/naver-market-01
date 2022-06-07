import mongoose from 'mongoose';
require('./User');

const orderSchema = new mongoose.Schema(
  {
    //user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user: { type: String, required: true },
    orderNo: { type: String, required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      contactNo1: { type: String, required: true },
      contactNo2: { type: String, required: false },
      address: { type: String, required: true },
      city: { type: String, required: false },
      postalCode: { type: String, required: false },
      country: { type: String, required: false },

      location: {
        lat: String,
        lng: String,
        address: String,
        name: String,
        vicinity: String,
        googleAddressId: String,
      },
    },
    paymentMethod: { type: String, required: false },
    paymentResult: { id: String, status: String, email_address: String },
    itemsPrice: { type: Number, required: false },
    shippingPrice: { type: Number, required: false },
    taxPrice: { type: Number, required: false },
    totalPrice: { type: Number, required: false },
    isPaid: { type: Boolean, required: false, default: false },
    isDelivered: { type: Boolean, required: false, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    billNo: { type: String, required: false },
    billPhoneNo: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
