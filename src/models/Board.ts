import mongoose from 'mongoose';

const DrawEventSchema = new mongoose.Schema({
  type: String,
  color: String,
  thickness: Number,
  points: [[Number]],
}, { _id: false });

const BoardSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  createdBy: { type: String, required: true },
  participants: [{ type: String }],
  drawings: [DrawEventSchema],
}, {
  timestamps: true,
});

export const Board = mongoose.models.Board || mongoose.model('Board', BoardSchema);
