import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    "type": String,
    "required": true,
    "unique": true
  },
  password: {
    "type": String,
    "required": true
  },
  token_version: {
    "type": Number,
    default: 0
  },
})

const userModel = mongoose.model("users", userSchema);

export default userModel;
