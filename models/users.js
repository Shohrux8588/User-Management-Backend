const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastLoginTime: {
    type: Date,
    default: new Date().getTime(),
    required: true,
  },
  registrationTime: {
    type: Date,
    default: new Date().getTime(),
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
