import axios from 'axios';
import type {
  DegreesOfSeparationResponse,
  ActorDetailResponse,
  HiddenCollaboratorsResponse,
  MovieDetailResponse,
  SearchResult,
  FeaturedEntitiesResponse,
  HealthStatus
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function checkHealth(): Promise<HealthStatus> {
  try {
    const res = await api.get<HealthStatus>('/health');
    return res.data;
  } catch (err: any) {
    return {
      status: 'degraded',
      database: {
        connected: false,
        uri: 'bolt://localhost:7687',
        error: err.response?.data?.error || err.message || 'Backend API server unreachable.'
      }
    };
  }
}

export async function searchEntities(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) return [];
  const res = await api.get<{ results: SearchResult[] }>('/search', {
    params: { q: query.trim() }
  });
  return res.data.results;
}

export async function getFeatured(): Promise<FeaturedEntitiesResponse> {
  const res = await api.get<FeaturedEntitiesResponse>('/featured');
  return res.data;
}

export async function getDegreesOfSeparation(fromActorId: string, toActorId: string): Promise<DegreesOfSeparationResponse> {
  const res = await api.get<DegreesOfSeparationResponse>('/connection/actors', {
    params: { from: fromActorId, to: toActorId }
  });
  return res.data;
}

export async function getActorDetail(actorId: string): Promise<ActorDetailResponse> {
  const res = await api.get<ActorDetailResponse>(`/actors/${actorId}`);
  return res.data;
}

export async function getHiddenCollaborators(actorId: string): Promise<HiddenCollaboratorsResponse> {
  const res = await api.get<HiddenCollaboratorsResponse>(`/actors/${actorId}/hidden-collaborators`);
  return res.data;
}

export async function getMovieDetail(movieId: string): Promise<MovieDetailResponse> {
  const res = await api.get<MovieDetailResponse>(`/movies/${movieId}`);
  return res.data;
}
