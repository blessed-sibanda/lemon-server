const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: 'Email already exists',
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
      required: [true, 'Email is required'],
    },
    name: {
      first: {
        type: String,
        trim: true,
        required: [true, 'First Name is required'],
      },
      middle: String,
      last: {
        type: String,
        trim: true,
        required: [true, 'Last Name is required'],
      },
    },
    picture: String,
    role: {
      type: String,
      enum: ['none', 'manager', 'clerk', 'cashier'],
      default: 'none',
    },
    userStatus: Boolean,
    level: Number,
    dateOfBirth: Date,
    address: {
      line1: {
        type: String,
        trim: true,
        required: [true, 'Address line is required'],
      },
      line2: String,
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      zip: {
        type: String,
        required: [true, 'Zip is required'],
      },
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required'],
    },
    salt: String,
    phones: [
      {
        type: {
          type: String,
          enum: ['work', 'mobile', 'none', 'home'],
          default: 'none',
        },
        digits: {
          type: String,
          required: [true, 'Phone number is required'],
        },
      },
    ],
  },
  { timestamps: true },
);

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto.createHash('sha1', this.salt).update(password).digest('hex');
    } catch (err) {
      return '';
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
};

userSchema.path('hashedPassword').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.');
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required');
  }
}, null);

module.exports = mongoose.model('User', userSchema);
