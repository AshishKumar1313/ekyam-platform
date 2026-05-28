import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['books', 'tools', 'skills', 'space', 'equipment', 'other'],
      default: 'other',
    },
    community: { type: String, trim: true, default: 'General' },
    availability: {
      type: String,
      enum: ['available', 'reserved', 'unavailable'],
      default: 'available',
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
