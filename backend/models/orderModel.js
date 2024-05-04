import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: "Products",
        },
        count: {
          type: Number,
          default: 1,
        },
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "delivered", "cancel"],
    },
    // total: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);