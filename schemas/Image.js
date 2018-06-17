const mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idUser: mongoose.Schema.Types.ObjectId,
  content: Object,
  favorite: Boolean,
  description: [String],
  keyword: String
}, {
  timestamps: true
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
