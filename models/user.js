import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: String,
  githubId: String,
  username: String,
  local: {
    password: String,
    email: String,
    name: String,
  },
  displayName: String,
  name: String,
  email: String,
});

userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
userSchema.index({ githubId: 1 }, { unique: true, sparse: true });
userSchema.index({ "local.email": 1 }, { unique: true, sparse: true });

const User = mongoose.model("User", userSchema);
export default User;
