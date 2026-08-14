const movieService = require('../services/movieService');

async function getMovieById(req, res, next) {
  try {
    const { id } = req.params;
    const movieData = await movieService.getMovieDetail(id);
    if (!movieData) {
      return res.status(404).json({ error: `Movie with ID "${id}" was not found in the graph.` });
    }
    return res.status(200).json(movieData);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMovieById
};
