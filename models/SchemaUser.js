const mongoose = require('mongoose');

const SchemaUser = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
      type: String,
      required: false,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: false,
  },
  born_date: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
    default: "https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"
  }
},{ timestamps: true, strict: true });

module.exports = mongoose.model('User', SchemaUser, 'users');
