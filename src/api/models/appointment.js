import mongoose, { Schema } from 'mongoose';

const appointmentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  scheduleSet: {
    type: Schema.Types.ObjectId,
    ref: 'ScheduleSet',
  },
  description: {
    type: String,
  },
  timeStart: String,
  timeEnd: String,
  color: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Appointment', appointmentSchema);