// routes/tables.js
const express = require('express');
const Table = require('../model/tablemode');

// Create table
exports.createTables= async (req, res) => {
  const { tableNumber, qrUrl } = req.body;
  try {
    const table = new Table({ tableNumber, qrUrl });
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all tables
exports.getTables= async (req, res) => {
  const tables = await Table.find();
  res.json(tables);
};

// Update table
exports.updateTables= async (req, res) => {
  const { tableNumber, qrUrl } = req.body;
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { tableNumber, qrUrl },
      { new: true }
    );
    res.json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete table
exports.deleteTables= async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: 'Table deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


