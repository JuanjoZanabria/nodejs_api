const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: {
    firstName: String,
    lastName: String,
    fullName: String
  },
  email: String,
  picture: String
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
