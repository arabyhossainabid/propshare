import { ApiErrorResponse } from '@/lib/api-types';
import axios, { AxiosError } from 'axios';

// In-memory token storage (session only, NOT persisted)
let sessionAccessToken: string | null = null;

export function setSessionAccessToken(token: string | null) {
  sessionAccessToken = token;
}

export function getSessionAccessToken() {
  return sessionAccessToken;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add Authorization token if available
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }

  const token = getSessionAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const unwrapResponse = <T>(
  response: { data?: { data?: T } } | null | undefined
) => {
  return response?.data?.data;
};

export const normalizeList = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) {
      return maybeData as T[];
    }
  }

  return [];
};

export const normalizeItem = <T>(payload: unknown): T | null => {
  if (!payload) {
    return null;
  }

  if (payload && typeof payload === 'object') {
    const maybeData = (payload as { data?: unknown }).data;
    if (
      maybeData &&
      typeof maybeData === 'object' &&
      !Array.isArray(maybeData)
    ) {
      return maybeData as T;
    }
  }

  if (typeof payload === 'object' && !Array.isArray(payload)) {
    return payload as T;
  }

  return null;
};

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const sources = axiosError.response?.data?.errorSources;
    if (Array.isArray(sources) && sources.length > 0) {
      const first = sources[0];
      if (first?.message) {
        return first.path ? `${first.path}: ${first.message}` : first.message;
      }
    }
    const fromApi = axiosError.response?.data?.message;
    if (fromApi) return fromApi;
    if (axiosError.message) return axiosError.message;
  }

  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
};

export const renderText = (text: any): string => {
  if (typeof text === 'string') return text;
  if (typeof text === 'number') return String(text);
  if (text && typeof text === 'object') {
    if (text.text) return String(text.text);
    return JSON.stringify(text);
  }
  return '';
};
