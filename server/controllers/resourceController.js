import Resource from '../models/Resource.js';
import Collaboration from '../models/Collaboration.js';

export const getResources = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.community) filter.community = req.query.community;
    if (req.query.availability) filter.availability = req.query.availability;

    const resources = await Resource.find(filter)
      .populate('owner', 'name community')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      'owner',
      'name email community bio'
    );
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createResource = async (req, res) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      owner: req.user._id,
    });
    const populated = await resource.populate('owner', 'name community');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (resource.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }

    Object.assign(resource, req.body);
    const updated = await resource.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (resource.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (resource.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request your own resource' });
    }

    if (resource.availability !== 'available') {
      return res.status(400).json({ message: 'Resource is not available' });
    }

    const existing = await Collaboration.findOne({
      resource: resource._id,
      requester: req.user._id,
      status: 'pending',
    });

    if (existing) {
      return res.status(400).json({ message: 'You already have a pending request' });
    }

    const collaboration = await Collaboration.create({
      type: 'resource',
      resource: resource._id,
      requester: req.user._id,
      owner: resource.owner,
      message: req.body.message || '',
    });

    const populated = await Collaboration.findById(collaboration._id)
      .populate('requester', 'name community')
      .populate('resource', 'title category');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
