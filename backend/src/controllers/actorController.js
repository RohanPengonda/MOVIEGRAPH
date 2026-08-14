const actorService = require('../services/actorService');

async function getActorById(req, res, next) {
  try {
    const { id } = req.params;
    const actorData = await actorService.getActorDetail(id);
    if (!actorData) {
      return res.status(404).json({ error: `Actor with ID "${id}" was not found in the graph.` });
    }
    return res.status(200).json(actorData);
  } catch (err) {
    next(err);
  }
}

async function getHiddenCollaborators(req, res, next) {
  try {
    const { id } = req.params;
    const data = await actorService.getHiddenCollaborators(id);
    if (!data) {
      return res.status(404).json({ error: `Actor with ID "${id}" was not found in the graph.` });
    }
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getActorById,
  getHiddenCollaborators
};
