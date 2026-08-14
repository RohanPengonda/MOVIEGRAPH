export type EntityType = 'Actor' | 'Movie' | 'Director' | 'Genre';

export interface SearchResult {
  type: EntityType;
  id: string;
  title: string;
  image: string;
  subtitle?: string | number;
  popularity: number;
}

export interface ActorNode {
  id: string;
  name: string;
  profileImageUrl: string;
  popularity?: number;
  birthYear?: number;
}

export interface MovieNode {
  id: string;
  title: string;
  overview?: string;
  releaseYear?: number;
  rating?: number;
  posterUrl: string;
  popularity?: number;
  role?: string;
}

export interface DirectorNode {
  id: string;
  name: string;
  profileImageUrl?: string;
}

export interface ConnectionPathNode {
  id: string;
  name: string;
  title: string;
  type: EntityType;
  image: string;
  year?: number | string;
  popularity?: number;
}

export interface ConnectionLink {
  source: string;
  target: string;
  role?: string;
}

export interface DegreesOfSeparationResponse {
  found: boolean;
  message?: string;
  degrees?: number;
  explanation?: string;
  path?: ConnectionPathNode[];
  nodes?: ConnectionPathNode[];
  links?: ConnectionLink[];
}

export interface ActorDetailResponse {
  actor: ActorNode;
  insights: {
    totalMovies: number;
    totalCollaborators: number;
    genres: string[];
    topCollaborator?: {
      id: string;
      name: string;
      profileImageUrl: string;
      collaborationCount: number;
    } | null;
  };
  filmography: MovieNode[];
  directCollaborators: {
    id: string;
    name: string;
    profileImageUrl: string;
    collaborationCount: number;
  }[];
}

export interface HiddenCollaborator {
  actor: ActorNode;
  commonMoviesCount: number;
  commonMovies: {
    id: string;
    title: string;
    releaseYear?: number;
    posterUrl?: string;
  }[];
}

export interface HiddenCollaboratorsResponse {
  targetActor: ActorNode;
  hiddenCollaborators: HiddenCollaborator[];
}

export interface MovieDetailResponse {
  movie: MovieNode;
  director?: DirectorNode | null;
  genres: string[];
  cast: {
    id: string;
    name: string;
    profileImageUrl: string;
    role: string;
    popularity?: number;
  }[];
}

export interface FeaturedEntitiesResponse {
  actors: ActorNode[];
  movies: MovieNode[];
}

export interface HealthStatus {
  status: 'healthy' | 'degraded';
  database: {
    connected: boolean;
    uri: string;
    error?: string;
  };
}
