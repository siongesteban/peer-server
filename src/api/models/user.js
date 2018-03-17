import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const notificationSchema = new Schema({
  _id: Schema.Types.ObjectId,
  message: String,
  url: String,
  checked: Boolean
}, {
  timestamps: true
});

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: String,
  password: String,
  givenName: String,
  familyName: String,
  imageUrl: String,
  ids: [
    {
      name: String,
      number: String,
    }
  ],
  notifications: [notificationSchema],
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note',
  }],
  schedules: [{
    type: Schema.Types.ObjectId,
    ref: 'Schedule',
  }],
}, {
  timestamps: true
});

userSchema.pre('save', function(next) {
  const user = this;

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        next(err);
      }

      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) {
          next(err);
        }

        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('User', userSchema);