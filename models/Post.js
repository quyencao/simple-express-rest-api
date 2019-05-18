const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      min: [7, "Title must have at least 5 characters"]
    },
    content: {
      type: String,
      required: true,
      min: [5, "Content must have at least 5 characters"]
    },
    imageUrl: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
