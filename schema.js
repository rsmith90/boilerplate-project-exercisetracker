const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
    },
    exercises: [
      {
        description: String,
        duration: { type: Number },
        date: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { versionKey: false }
);

const User = mongoose.model('User', userSchema);
exports.User = User;