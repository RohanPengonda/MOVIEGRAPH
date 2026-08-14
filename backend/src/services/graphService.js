const { getSession, neo4j } = require('../config/db');
const QUERIES = require('../queries/cypher');

/**
 * Parses a raw Neo4j shortest path object into visual nodes, edges, and natural text.
 */
function parsePathData(pathRecord) {
  if (!pathRecord) return null;
  const path = pathRecord.get('path');
  if (!path) return null;

  const rawSegments = path.segments || [];
  const nodes = [];
  const links = [];
  const timeline = [];
  const nodeMap = new Map();

  // Helper to extract node properties safely
  const formatNode = (node) => {
    const labels = node.labels || [];
    const type = labels[0] || 'Unknown';
    const props = node.properties || {};
    return {
      id: props.id,
      name: props.name || props.title || 'Unknown',
      title: props.title || props.name || 'Unknown',
      type: type,
      image: props.profileImageUrl || props.posterUrl || '',
      year: props.birthYear || props.releaseYear || '',
      popularity: props.popularity || 0
    };
  };

  if (path.start) {
    const startNode = formatNode(path.start);
    nodes.push(startNode);
    nodeMap.set(startNode.id, startNode);
    timeline.push(startNode);
  }

  for (const seg of rawSegments) {
    const endNode = formatNode(seg.end);
    if (!nodeMap.has(endNode.id)) {
      nodes.push(endNode);
      nodeMap.set(endNode.id, endNode);
    }
    timeline.push(endNode);

    const startId = seg.start.properties.id;
    const endId = seg.end.properties.id;
    const role = seg.relationship.properties.role || 'ACTED_IN';

    links.push({
      source: startId,
      target: endId,
      role: role
    });
  }

  // Calculate degrees of separation (number of movie nodes in connection path)
  const movieNodes = nodes.filter(n => n.type === 'Movie');
  const degrees = movieNodes.length;

  // Generate natural language explanation
  let explanation = '';
  if (nodes.length <= 1) {
    explanation = 'Both selected actors are the same person.';
  } else {
    const parts = [];
    for (let i = 0; i < timeline.length - 1; i += 2) {
      const actor1 = timeline[i];
      const movie = timeline[i + 1];
      const actor2 = timeline[i + 2];
      if (actor1 && movie && actor2) {
        parts.push(`${actor1.name} acted in "${movie.title}" (${movie.year}) with ${actor2.name}`);
      }
    }
    explanation = parts.join(', who then ') + '.';
  }

  return {
    degrees,
    explanation,
    path: timeline,
    nodes,
    links
  };
}

async function findConnection(actorId1, actorId2) {
  if (!actorId1 || !actorId2) {
    throw new Error('Both actorId1 and actorId2 parameters are required.');
  }

  if (actorId1 === actorId2) {
    const session = getSession();
    try {
      const result = await session.run(`MATCH (a:Actor {id: $id}) RETURN a`, { id: actorId1 });
      if (result.records.length === 0) return null;
      const nodeProps = result.records[0].get('a').properties;
      return {
        degrees: 0,
        explanation: `${nodeProps.name} is the same actor.`,
        path: [{ id: nodeProps.id, name: nodeProps.name, type: 'Actor', image: nodeProps.profileImageUrl }],
        nodes: [{ id: nodeProps.id, name: nodeProps.name, type: 'Actor', image: nodeProps.profileImageUrl }],
        links: []
      };
    } finally {
      await session.close();
    }
  }

  const session = getSession();
  try {
    const result = await session.run(QUERIES.FIND_SHORTEST_PATH, {
      actorId1,
      actorId2
    });

    if (result.records.length === 0) {
      return null; // No path found within 6 hops
    }

    return parsePathData(result.records[0]);
  } finally {
    await session.close();
  }
}

module.exports = {
  findConnection
};
