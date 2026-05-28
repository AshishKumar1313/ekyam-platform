import Collaboration from '../models/Collaboration.js';
import Resource from '../models/Resource.js';
import Project from '../models/Project.js';

export const getMyCollaborations = async (req, res) => {
  try {
    const collaborations = await Collaboration.find({
      $or: [{ requester: req.user._id }, { owner: req.user._id }],
    })
      .populate('requester', 'name community')
      .populate('owner', 'name')
      .populate('resource', 'title category availability')
      .populate('project', 'title status maxMembers')
      .sort({ createdAt: -1 });

    res.json(collaborations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCollaborationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const collaboration = await Collaboration.findById(req.params.id)
      .populate('resource')
      .populate('project');

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration not found' });
    }

    if (collaboration.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can update this request' });
    }

    collaboration.status = status;
    await collaboration.save();

    if (status === 'approved') {
      if (collaboration.type === 'resource' && collaboration.resource) {
        const resource = await Resource.findById(collaboration.resource._id);
        if (resource) {
          resource.availability = 'reserved';
          await resource.save();
        }
      }

      if (collaboration.type === 'project' && collaboration.project) {
        const project = await Project.findById(collaboration.project._id);
        if (project && !project.members.includes(collaboration.requester)) {
          project.members.push(collaboration.requester);
          if (project.status === 'planning') project.status = 'active';
          await project.save();
        }
      }
    }

    if (status === 'completed' && collaboration.type === 'resource' && collaboration.resource) {
      const resource = await Resource.findById(collaboration.resource._id);
      if (resource) {
        resource.availability = 'available';
        await resource.save();
      }
    }

    const updated = await Collaboration.findById(collaboration._id)
      .populate('requester', 'name community')
      .populate('resource', 'title')
      .populate('project', 'title');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
