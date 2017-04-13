var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },

  preferences: {
    type: Array,
    required: true,
    trim: true
},
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  photo: {
    type: String,
    trim: true,
  },
  playlist: {
    type: String,
    trim: true
  },
  playlistType: {
    type: String,
    trim: true
  }
});


var User = mongoose.model('User', UserSchema);
module.exports = User;
