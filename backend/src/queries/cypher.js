/**
 * Centralized Catalog of Parameterized Cypher Queries for MovieGraph.
 * All Cypher string values are parameter-bound via Neo4j Driver — NEVER string-concatenated.
 */

const QUERIES = {
  // 1. Shortest Path (Degrees of Separation)
  FIND_SHORTEST_PATH: `
    MATCH (a:Actor {id: $actorId1}), (b:Actor {id: $actorId2})
    MATCH path = shortestPath((a)-[:ACTED_IN*..6]-(b))
    RETURN path
  `,

  // 2. Hidden Collaborators (SQL-awkward multi-self-join query)
  FIND_HIDDEN_COLLABORATORS: `
    MATCH (a:Actor {id: $actorId})-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(shared:Actor)
    WHERE a <> shared
    WITH a, shared, count(DISTINCT m) AS commonMoviesCount, collect(DISTINCT {id: m.id, title: m.title, releaseYear: m.releaseYear, posterUrl: m.posterUrl}) AS commonMovies
    WHERE commonMoviesCount >= 3
      AND NOT (a)-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(shared)
    RETURN shared, commonMoviesCount, commonMovies
    ORDER BY commonMoviesCount DESC
    LIMIT 10
  `,

  // 3. Actor Detail with Graph-derived Insights & Network
  GET_ACTOR_DETAIL: `
    MATCH (a:Actor {id: $actorId})
    OPTIONAL MATCH (a)-[r:ACTED_IN]->(m:Movie)
    OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)
    OPTIONAL MATCH (a)-[:ACTED_IN]->(m2:Movie)<-[:ACTED_IN]-(collab:Actor)
    WHERE a <> collab
    WITH a, 
         collect(DISTINCT {
           id: m.id,
           title: m.title,
           releaseYear: m.releaseYear,
           rating: m.rating,
           posterUrl: m.posterUrl,
           role: r.role
         }) AS movies,
         count(DISTINCT m) AS totalMovies,
         count(DISTINCT collab) AS totalCollaborators,
         collect(DISTINCT g.name) AS genres,
         collab,
         count(DISTINCT m2) AS collabCount
    ORDER BY collabCount DESC
    WITH a, movies, totalMovies, totalCollaborators, genres,
         collect({
           id: collab.id,
           name: collab.name,
           profileImageUrl: collab.profileImageUrl,
           collaborationCount: collabCount
         }) AS rankedCollaborators
    RETURN a AS actor,
           movies,
           totalMovies,
           totalCollaborators,
           genres,
           rankedCollaborators[0] AS topCollaborator,
           rankedCollaborators[..12] AS directCollaborators
  `,

  // 4. Movie Detail with Full Cast, Director, & Genres
  GET_MOVIE_DETAIL: `
    MATCH (m:Movie {id: $movieId})
    OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m)
    OPTIONAL MATCH (a:Actor)-[r:ACTED_IN]->(m)
    OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)
    RETURN m AS movie,
           d AS director,
           collect(DISTINCT g.name) AS genres,
           collect(DISTINCT {
             id: a.id,
             name: a.name,
             profileImageUrl: a.profileImageUrl,
             role: r.role,
             popularity: a.popularity
           }) AS cast
  `,

  // 5. Global Unified Search (Actors + Movies)
  GLOBAL_SEARCH: `
    MATCH (n)
    WHERE (n:Actor AND toLower(n.name) CONTAINS toLower($query))
       OR (n:Movie AND toLower(n.title) CONTAINS toLower($query))
    RETURN labels(n)[0] AS type,
           n.id AS id,
           coalesce(n.name, n.title) AS title,
           coalesce(n.profileImageUrl, n.posterUrl) AS image,
           coalesce(n.birthYear, n.releaseYear) AS subtitle,
           n.popularity AS popularity
    ORDER BY n.popularity DESC
    LIMIT 15
  `,

  // 6. Featured / Recommended Entities for Initial View
  GET_FEATURED_ENTITIES: `
    MATCH (a:Actor)
    WITH a ORDER BY a.popularity DESC LIMIT 6
    MATCH (m:Movie)
    WITH a, m ORDER BY m.popularity DESC LIMIT 6
    RETURN collect(DISTINCT a) AS featuredActors, collect(DISTINCT m) AS featuredMovies
  `
};

module.exports = QUERIES;
