import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  coingecko_id: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const trackerModel = mongoose.model("trackers", trackerSchema);

export default trackerModel;
