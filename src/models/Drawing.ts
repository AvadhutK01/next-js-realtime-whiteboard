
import mongoose, { Schema, models } from 'mongoose';

const PointSchema = new Schema({
  x: Number,
  y: Number,
});

const LineSchema = new Schema({
  from: PointSchema,
  to: PointSchema,
  boardId: String,
  createdAt: { type: Date, default: Date.now },
});

export const Drawing =
  models.Drawing || mongoose.model('Drawing', LineSchema);
