# MovieGraph System Architecture

```
[ Frontend: React + TypeScript + Vite + Canvas Graph ]
                     │
                     │ REST API Requests (JSON over HTTP)
                     ▼
[ Express API Layer: Controllers & Input Validation ]
                     │
                     │ Service Invocation
                     ▼
[ Service Layer: actorService / graphService / movieService ]
                     │
                     │ Parameterized Cypher Strings
                     ▼
[ Query Catalog: backend/src/queries/cypher.js ]
                     │
                     │ Neo4j Driver Session (Bolt Protocol)
                     ▼
[ Database: CognoDB / Neo4j Graph Database ]
```

## Layer Responsibilities
1. **Frontend**: Render interactive network graph (`react-force-graph-2d`), debounced search inputs, degrees of separation path timeline, and actor/movie detail pages with glassmorphism UI.
2. **Backend Controllers**: Validate path/query params (`from`, `to`, `id`, `q`) and handle clean JSON error responses.
3. **Service Layer**: Execute multi-hop Cypher queries, format graph paths into visual nodes/edges array, and construct natural language connection summaries.
4. **Driver & Database Layer**: Connection pool management (`backend/src/config/db.js`), Bolt session lifecycle management, and automatic health monitoring.
