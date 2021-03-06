const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "active"
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post"
    }
  ]
});

userSchema.methods.deletePost = function(postId) {
  this.posts.pull(postId);
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
