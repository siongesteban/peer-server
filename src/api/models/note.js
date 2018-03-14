import mongoose, { Schema } from 'mongoose';

import { noteCollabSchema } from './noteCollab';

// const noteSchema = new Schema({
//   _id: Schema.Types.ObjectId,
//   title: {
//     type: String,
//     required: true
//   },
//   text: String,
//   author: String,
//   color: String,
//   collabs: {
//     type: [noteCollabSchema],
//     required: false
//   },
//   deleted: {
//     type: Boolean,
//     default: false
//   },
//   updatedAt: Date
// });

const noteSchema = new Schema({
  _id: Schema.Types.ObjectId,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  color: String,
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  collabs: [{
    type: Schema.Types.ObjectId,
    ref: 'NoteCollab',
  }],
  tags: [String],
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Note', noteSchema);