const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true, unique: true },
  qrUrl: { type: String, required: true }
});

module.exports = mongoose.model('Table', TableSchema,'table');