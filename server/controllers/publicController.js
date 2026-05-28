import User from '../models/User.js';
import Resource from '../models/Resource.js';
import Project from '../models/Project.js';
import Collaboration from '../models/Collaboration.js';

export const getPublicStats = async (req, res) => {
  try {
    const [users, resources, projects, collaborations] = await Promise.all([
      User.countDocuments({ isVerified: { $ne: false } }),
      Resource.countDocuments(),
      Project.countDocuments(),
      Collaboration.countDocuments({ status: 'approved' }),
    ]);

    const communitySet = new Set();
    const [userCommunities, resourceCommunities, projectCommunities] = await Promise.all([
      User.distinct('community', { community: { $nin: ['', null] } }),
      Resource.distinct('community'),
      Project.distinct('community'),
    ]);

    [...userCommunities, ...resourceCommunities, ...projectCommunities].forEach((c) => {
      if (c && c !== 'General') communitySet.add(c);
    });

    res.json({
      users,
      resources,
      projects,
      collaborations,
      communities: communitySet.size || userCommunities.filter(Boolean).length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommunities = async (req, res) => {
  try {
    const [users, resources, projects] = await Promise.all([
      User.find({ community: { $nin: ['', null] } }).select('community name'),
      Resource.find().select('community category'),
      Project.find().select('community status members'),
    ]);

    const map = new Map();

    const ensure = (name) => {
      const key = name || 'General';
      if (!map.has(key)) {
        map.set(key, { name: key, members: 0, resources: 0, projects: 0 });
      }
      return map.get(key);
    };

    users.forEach((u) => {
      const c = ensure(u.community || 'General');
      c.members += 1;
    });

    resources.forEach((r) => {
      const c = ensure(r.community || 'General');
      c.resources += 1;
    });

    projects.forEach((p) => {
      const c = ensure(p.community || 'General');
      c.projects += 1;
    });

    const communities = [...map.values()]
      .filter((c) => c.name !== 'General' || map.size === 1)
      .sort((a, b) => b.members + b.projects - (a.members + a.projects));

    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: { $in: ['active', 'planning'] } })
      .populate('organizer', 'name community')
      .populate('members', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
