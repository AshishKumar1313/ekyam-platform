import Project from '../models/Project.js';
import Collaboration from '../models/Collaboration.js';

export const getProjects = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.community) filter.community = req.query.community;

    const projects = await Project.find(filter)
      .populate('organizer', 'name community')
      .populate('members', 'name')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('organizer', 'name email community bio')
      .populate('members', 'name community');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      organizer: req.user._id,
      members: [req.user._id],
    });

    const populated = await Project.findById(project._id)
      .populate('organizer', 'name community')
      .populate('members', 'name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isOrganizer = project.organizer.toString() === req.user._id.toString();
    if (!isOrganizer && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    Object.assign(project, req.body);
    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isOrganizer = project.organizer.toString() === req.user._id.toString();
    if (!isOrganizer && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.organizer.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You are already the organizer' });
    }

    const alreadyMember = project.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member' });
    }

    if (project.members.length >= project.maxMembers) {
      return res.status(400).json({ message: 'Project is full' });
    }

    const existing = await Collaboration.findOne({
      project: project._id,
      requester: req.user._id,
      status: 'pending',
    });

    if (existing) {
      return res.status(400).json({ message: 'Join request already pending' });
    }

    const collaboration = await Collaboration.create({
      type: 'project',
      project: project._id,
      requester: req.user._id,
      owner: project.organizer,
      message: req.body.message || '',
    });

    const populated = await Collaboration.findById(collaboration._id)
      .populate('requester', 'name community')
      .populate('project', 'title status');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
