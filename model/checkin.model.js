const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
    name: String,
    timestamp: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('Checkin', checkinSchema);
