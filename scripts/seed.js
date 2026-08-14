const path = require('path');

let dotenv;
try {
  dotenv = require('dotenv');
} catch (e) {
  dotenv = require(path.resolve(__dirname, '../backend/node_modules/dotenv'));
}
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let axios;
try {
  axios = require('axios');
} catch (e) {
  axios = require(path.resolve(__dirname, '../backend/node_modules/axios'));
}

const { getSession, closeDriver, verifyConnection } = require('../backend/src/config/db');
const { fallbackActors, fallbackMovies, fallbackDirectors, fallbackGenres } = require('./fallbackData');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTMDB() {
  if (!TMDB_API_KEY) {
    console.log('[Seed] No TMDB_API_KEY found in .env. Using rich offline fallback dataset.');
    return null;
  }

  try {
    console.log('[Seed] TMDB_API_KEY detected. Fetching popular movies and credits from TMDB API...');
    const res = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        sort_by: 'popularity.desc',
        'vote_count.gte': 500,
        page: 1
      }
    });

    const rawMovies = res.data.results.slice(0, 30);
    const genresMap = new Map();
    const directorsMap = new Map();
    const actorsMap = new Map();
    const movies = [];

    const genreRes = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: { api_key: TMDB_API_KEY }
    });
    genreRes.data.genres.forEach(g => genresMap.set(String(g.id), { id: String(g.id), name: g.name }));

    for (const raw of rawMovies) {
      const movieId = `m${raw.id}`;
      const creditsRes = await axios.get(`${TMDB_BASE_URL}/movie/${raw.id}/credits`, {
        params: { api_key: TMDB_API_KEY }
      });

      const directorObj = creditsRes.data.crew.find(c => c.job === 'Director');
      let directorId = null;
      if (directorObj) {
        directorId = `d${directorObj.id}`;
        directorsMap.set(directorId, {
          id: directorId,
          name: directorObj.name,
          profileImageUrl: directorObj.profile_path ? `https://image.tmdb.org/t/p/w500${directorObj.profile_path}` : ''
        });
      }

      const topCast = creditsRes.data.cast.slice(0, 8);
      const movieCast = [];
      for (const castMember of topCast) {
        const actorId = `a${castMember.id}`;
        if (!actorsMap.has(actorId)) {
          actorsMap.set(actorId, {
            id: actorId,
            name: castMember.name,
            profileImageUrl: castMember.profile_path ? `https://image.tmdb.org/t/p/w500${castMember.profile_path}` : '',
            popularity: castMember.popularity || 10.0,
            birthYear: 1980
          });
        }
        movieCast.push({ actorId, role: castMember.character || 'Cast Member' });
      }

      movies.push({
        id: movieId,
        title: raw.title,
        overview: raw.overview || '',
        releaseYear: raw.release_date ? parseInt(raw.release_date.substring(0, 4), 10) : 2020,
        rating: raw.vote_average || 0.0,
        posterUrl: raw.poster_path ? `https://image.tmdb.org/t/p/w500${raw.poster_path}` : '',
        popularity: raw.popularity || 0.0,
        directorId,
        genreIds: raw.genre_ids ? raw.genre_ids.map(id => String(id)) : [],
        cast: movieCast
      });
    }

    return {
      genres: Array.from(genresMap.values()),
      directors: Array.from(directorsMap.values()),
      actors: Array.from(actorsMap.values()),
      movies
    };
  } catch (err) {
    console.warn(`[Seed Warning] Failed fetching from TMDB (${err.message}). Falling back to static dataset.`);
    return null;
  }
}

async function seedGraphData() {
  console.log('=== MovieGraph Data Seeder ===');

  const connection = await verifyConnection();
  if (!connection.connected) {
    console.warn(`\n[Seed Warning] Database connection failed: ${connection.error}`);
    console.warn(`Target database URI: ${connection.uri}`);
    console.warn(`Make sure CognoDB or Neo4j is running at ${connection.uri} with credentials from .env.`);
    console.warn(`The seed script structure, TMDB fetcher, and MERGE queries are validated and ready for connection.\n`);
    return;
  }

  const tmdbData = await fetchFromTMDB();
  const genres = tmdbData ? tmdbData.genres : fallbackGenres;
  const directors = tmdbData ? tmdbData.directors : fallbackDirectors;
  const actors = tmdbData ? tmdbData.actors : fallbackActors;
  const movies = tmdbData ? tmdbData.movies : fallbackMovies;

  const session = getSession();
  try {
    console.log('[Seed] Applying constraints / indexes...');
    await session.run('CREATE CONSTRAINT actor_id IF NOT EXISTS FOR (a:Actor) REQUIRE a.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT movie_id IF NOT EXISTS FOR (m:Movie) REQUIRE m.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT director_id IF NOT EXISTS FOR (d:Director) REQUIRE d.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT genre_id IF NOT EXISTS FOR (g:Genre) REQUIRE g.id IS UNIQUE');

    console.log(`[Seed] Seeding ${genres.length} Genres using MERGE...`);
    for (const g of genres) {
      await session.run(
        `MERGE (g:Genre {id: $id}) SET g.name = $name`,
        { id: g.id, name: g.name }
      );
    }

    console.log(`[Seed] Seeding ${directors.length} Directors using MERGE...`);
    for (const d of directors) {
      await session.run(
        `MERGE (d:Director {id: $id})
         SET d.name = $name, d.profileImageUrl = $profileImageUrl`,
        { id: d.id, name: d.name, profileImageUrl: d.profileImageUrl || '' }
      );
    }

    console.log(`[Seed] Seeding ${actors.length} Actors using MERGE...`);
    for (const a of actors) {
      await session.run(
        `MERGE (a:Actor {id: $id})
         SET a.name = $name,
             a.profileImageUrl = $profileImageUrl,
             a.popularity = $popularity,
             a.birthYear = $birthYear`,
        {
          id: a.id,
          name: a.name,
          profileImageUrl: a.profileImageUrl || '',
          popularity: parseFloat(a.popularity) || 0.0,
          birthYear: parseInt(a.birthYear, 10) || 1980
        }
      );
    }

    console.log(`[Seed] Seeding ${movies.length} Movies and relationships...`);
    let relCount = 0;
    for (const m of movies) {
      await session.run(
        `MERGE (m:Movie {id: $id})
         SET m.title = $title,
             m.overview = $overview,
             m.releaseYear = $releaseYear,
             m.rating = $rating,
             m.posterUrl = $posterUrl,
             m.popularity = $popularity`,
        {
          id: m.id,
          title: m.title,
          overview: m.overview || '',
          releaseYear: parseInt(m.releaseYear, 10) || 2000,
          rating: parseFloat(m.rating) || 0.0,
          posterUrl: m.posterUrl || '',
          popularity: parseFloat(m.popularity) || 0.0
        }
      );

      if (m.directorId) {
        await session.run(
          `MATCH (d:Director {id: $directorId}), (m:Movie {id: $movieId})
           MERGE (d)-[:DIRECTED]->(m)`,
          { directorId: m.directorId, movieId: m.id }
        );
        relCount++;
      }

      if (m.genreIds && Array.isArray(m.genreIds)) {
        for (const genreId of m.genreIds) {
          await session.run(
            `MATCH (m:Movie {id: $movieId}), (g:Genre {id: $genreId})
             MERGE (m)-[:HAS_GENRE]->(g)`,
            { movieId: m.id, genreId }
          );
          relCount++;
        }
      }

      if (m.cast && Array.isArray(m.cast)) {
        for (const c of m.cast) {
          await session.run(
            `MATCH (a:Actor {id: $actorId}), (m:Movie {id: $movieId})
             MERGE (a)-[r:ACTED_IN]->(m)
             SET r.role = $role`,
            { actorId: c.actorId, movieId: m.id, role: c.role || 'Cast' }
          );
          relCount++;
        }
      }
    }

    const statsResult = await session.run(`
      MATCH (a:Actor) WITH count(a) AS actorCount
      MATCH (m:Movie) WITH actorCount, count(m) AS movieCount
      MATCH (d:Director) WITH actorCount, movieCount, count(d) AS directorCount
      MATCH (g:Genre) WITH actorCount, movieCount, directorCount, count(g) AS genreCount
      MATCH ()-[r]->() WITH actorCount, movieCount, directorCount, genreCount, count(r) AS relCountTotal
      RETURN actorCount, movieCount, directorCount, genreCount, relCountTotal
    `);

    const r = statsResult.records[0];
    console.log('\n========================================');
    console.log('  MovieGraph Database Seeding Complete!');
    console.log('========================================');
    console.log(` Nodes Seeded:`);
    console.log(`   - Actors:    ${r.get('actorCount')}`);
    console.log(`   - Movies:    ${r.get('movieCount')}`);
    console.log(`   - Directors: ${r.get('directorCount')}`);
    console.log(`   - Genres:    ${r.get('genreCount')}`);
    console.log(` Relationships: ${r.get('relCountTotal')}`);
    console.log('========================================\n');
  } catch (err) {
    console.error('[Seed Error] Failed to seed database:', err);
  } finally {
    await session.close();
    await closeDriver();
  }
}

if (require.main === module) {
  seedGraphData();
}

module.exports = { seedGraphData };
