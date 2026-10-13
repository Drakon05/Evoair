import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Unique index
      lowercase: true,
      trim: true,
      index: true, 
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      default: ['user'],
    },
    // We decided on short-lived access tokens + refresh tokens, so we might store a hash of the refresh token or family here later.
    refreshTokenVersion: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
