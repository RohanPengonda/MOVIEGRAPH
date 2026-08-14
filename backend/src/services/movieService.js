const { getSession } = require('../config/db');
const QUERIES = require('../queries/cypher');

async function getMovieDetail(movieId) {
  const session = getSession();
  try {
    const result = await session.run(QUERIES.GET_MOVIE_DETAIL, { movieId });
    if (result.records.length === 0 || !result.records[0].get('movie')) {
      return null;
    }

    const record = result.records[0];
    const movieProps = record.get('movie').properties;
    const director = record.get('director') ? record.get('director').properties : null;
    const genres = record.get('genres') || [];
    const cast = record.get('cast') || [];

    return {
      movie: {
        id: movieProps.id,
        title: movieProps.title,
        overview: movieProps.overview || '',
        releaseYear: movieProps.releaseYear || null,
        rating: movieProps.rating || 0,
        posterUrl: movieProps.posterUrl || '',
        popularity: movieProps.popularity || 0
      },
      director: director ? {
        id: director.id,
        name: director.name,
        profileImageUrl: director.profileImageUrl || ''
      } : null,
      genres,
      cast: cast.filter(c => c && c.id).sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    };
  } finally {
    await session.close();
  }
}

module.exports = {
  getMovieDetail
};
