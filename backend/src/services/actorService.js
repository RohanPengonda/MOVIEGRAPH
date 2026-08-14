const { getSession } = require('../config/db');
const QUERIES = require('../queries/cypher');

async function getActorDetail(actorId) {
  const session = getSession();
  try {
    const result = await session.run(QUERIES.GET_ACTOR_DETAIL, { actorId });
    if (result.records.length === 0 || !result.records[0].get('actor')) {
      return null;
    }

    const record = result.records[0];
    const actorProps = record.get('actor').properties;
    const movies = record.get('movies') || [];
    const totalMovies = record.get('totalMovies') || 0;
    const totalCollaborators = record.get('totalCollaborators') || 0;
    const genres = record.get('genres') || [];
    const topCollaborator = record.get('topCollaborator') || null;
    const directCollaborators = record.get('directCollaborators') || [];

    return {
      actor: {
        id: actorProps.id,
        name: actorProps.name,
        profileImageUrl: actorProps.profileImageUrl || '',
        popularity: actorProps.popularity || 0,
        birthYear: actorProps.birthYear || null
      },
      insights: {
        totalMovies,
        totalCollaborators,
        genres,
        topCollaborator: topCollaborator && topCollaborator.id ? topCollaborator : null
      },
      filmography: movies.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0)),
      directCollaborators: directCollaborators.filter(c => c && c.id)
    };
  } finally {
    await session.close();
  }
}

async function getHiddenCollaborators(actorId) {
  const session = getSession();
  try {
    // First get target actor info
    const actorRes = await session.run(`MATCH (a:Actor {id: $actorId}) RETURN a`, { actorId });
    if (actorRes.records.length === 0) return null;
    const targetActor = actorRes.records[0].get('a').properties;

    const result = await session.run(QUERIES.FIND_HIDDEN_COLLABORATORS, { actorId });
    
    const hiddenCollaborators = result.records.map(record => {
      const sharedProps = record.get('shared').properties;
      const commonMoviesCount = record.get('commonMoviesCount');
      const commonMovies = record.get('commonMovies');
      return {
        actor: {
          id: sharedProps.id,
          name: sharedProps.name,
          profileImageUrl: sharedProps.profileImageUrl || '',
          popularity: sharedProps.popularity || 0
        },
        commonMoviesCount,
        commonMovies
      };
    });

    return {
      targetActor: {
        id: targetActor.id,
        name: targetActor.name,
        profileImageUrl: targetActor.profileImageUrl
      },
      hiddenCollaborators
    };
  } finally {
    await session.close();
  }
}

async function searchEntities(query) {
  if (!query || query.trim().length === 0) return [];
  const session = getSession();
  try {
    const result = await session.run(QUERIES.GLOBAL_SEARCH, { query: query.trim() });
    return result.records.map(rec => ({
      type: rec.get('type'),
      id: rec.get('id'),
      title: rec.get('title'),
      image: rec.get('image') || '',
      subtitle: rec.get('subtitle') || '',
      popularity: rec.get('popularity') || 0
    }));
  } finally {
    await session.close();
  }
}

async function getFeaturedEntities() {
  const session = getSession();
  try {
    const result = await session.run(QUERIES.GET_FEATURED_ENTITIES);
    if (result.records.length === 0) return { actors: [], movies: [] };
    const rec = result.records[0];
    const actors = (rec.get('featuredActors') || []).map(a => a.properties);
    const movies = (rec.get('featuredMovies') || []).map(m => m.properties);
    return { actors, movies };
  } finally {
    await session.close();
  }
}

module.exports = {
  getActorDetail,
  getHiddenCollaborators,
  searchEntities,
  getFeaturedEntities
};
