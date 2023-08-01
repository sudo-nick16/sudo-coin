import mongoose from "mongoose";

const limitTrackerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  tracker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  coingecko_id: {
    type: String,
    required: true
  },
  upper_limit: {
    type: Number,
    required: true
  },
  lower_limit: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

const limitTrackerModel = mongoose.model("limit_trackers", limitTrackerSchema);

export default limitTrackerModel;
