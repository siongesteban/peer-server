import mongoose, { Schema } from 'mongoose';

export const noteCollabSchema = new Schema({
  _id: Schema.Types.ObjectId,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  parentNote: {
    type: Schema.Types.ObjectId,
    ref: 'Note',
  },
  content: String,
}, {
  timestamps: true,
});

export default mongoose.model('NoteCollab', noteCollabSchema);