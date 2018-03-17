import mongoose, { Schema } from 'mongoose';

const schedule = new Schema({
  _id: Schema.Types.ObjectId,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
  },
  appointments: [{
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
  }],
  color: String,
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Schedule', schedule);