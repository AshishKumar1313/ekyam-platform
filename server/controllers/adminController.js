import User from '../models/User.js';
import Resource from '../models/Resource.js';
import Project from '../models/Project.js';
import Collaboration from '../models/Collaboration.js';

export const getStats = async (req, res) => {
  try {
    const [users, resources, projects, collaborations, pendingRequests] =
      await Promise.all([
        User.countDocuments(),
        Resource.countDocuments(),
        Project.countDocuments(),
        Collaboration.countDocuments(),
        Collaboration.countDocuments({ status: 'pending' }),
      ]);

    res.json({
      users,
      resources,
      projects,
      collaborations,
      pendingRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
