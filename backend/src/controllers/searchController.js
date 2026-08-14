const actorService = require('../services/actorService');

async function searchEntities(req, res, next) {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(200).json({ results: [] });
    }
    const results = await actorService.searchEntities(q);
    return res.status(200).json({ results });
  } catch (err) {
    next(err);
  }
}

async function getFeatured(req, res, next) {
  try {
    const data = await actorService.getFeaturedEntities();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  searchEntities,
  getFeatured
};
