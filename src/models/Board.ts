import mongoose from 'mongoose';

const DrawEventSchema = new mongoose.Schema({
  type: String, // e.g., 'line'
  color: String,
  thickness: Number,
  points: [[Number]], // array of [x, y]
}, { _id: false });

const BoardSchema = new mongoose.Schema({
  name: String,
  createdBy: String,
  drawings: [DrawEventSchema],
}, {
  timestamps: true,
});

export const Board = mongoose.models.Board || mongoose.model('Board', BoardSchema);
