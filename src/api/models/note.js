import mongoose, { Schema } from 'mongoose';

const noteSchema = new Schema({
  _id: Schema.Types.ObjectId,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  parentNote: {
    type: Schema.Types.ObjectId,
    ref: 'Note',
  },
  isPartOfCollab: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  color: {
    type: String,
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  collabs: [{
    type: Schema.Types.ObjectId,
    ref: 'Note',
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