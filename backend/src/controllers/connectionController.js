const graphService = require('../services/graphService');

async function getDegreesOfSeparation(req, res, next) {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({
        error: 'Missing required query parameters: "from" and "to" actor IDs are required.'
      });
    }

    const connectionData = await graphService.findConnection(from, to);
    if (!connectionData) {
      return res.status(200).json({
        found: false,
        message: 'No path found between these two actors within 6 degrees of separation.'
      });
    }

    return res.status(200).json({
      found: true,
      ...connectionData
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDegreesOfSeparation
};
