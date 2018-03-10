import mongoose, { Schema } from 'mongoose';

const collabSchema = new Schema({
  _id: Schema.Types.ObjectId,
  text: String,
  author: String
});

const noteSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  text: String,
  author: String,
  color: String,
  collabs: {
    type: [collabSchema],
    required: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  updatedAt: Date
});

export default mongoose.model('Note', noteSchema);