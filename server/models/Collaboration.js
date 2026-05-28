import mongoose from 'mongoose';

const collaborationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['resource', 'project'], required: true },
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Collaboration = mongoose.model('Collaboration', collaborationSchema);
export default Collaboration;
