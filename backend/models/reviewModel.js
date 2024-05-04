import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        body: {
            type : String,
            required: true,
        },
        rating: {
            type : Number,
            default: 0,
        },
        author: {
            type: mongoose.ObjectId,
            ref: 'users'
        },
    },
    { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);