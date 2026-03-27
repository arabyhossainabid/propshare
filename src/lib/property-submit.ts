import axios from 'axios';

import { api } from '@/lib/api';

const isAlreadySubmittedMessage = (message?: string) => {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return (
    (normalized.includes('already') && normalized.includes('review')) ||
    normalized.includes('under review')
  );
};

export const extractPropertyIdFromCreateResponse = (
  payload: unknown
): string | null => {
  if (!payload || typeof payload !== 'object') return null;

  const root = payload as {
    id?: unknown;
    data?: {
      id?: unknown;
      data?: { id?: unknown };
    };
  };

  if (typeof root.id === 'string') return root.id;
  if (typeof root.data?.id === 'string') return root.data.id;
  if (typeof root.data?.data?.id === 'string') return root.data.data.id;

  return null;
};

export const submitPropertyForReview = async (propertyId: string) => {
  try {
    await api.post(`/properties/${propertyId}/submit`);
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error;
    }

    const message =
      (error.response?.data as { message?: string } | undefined)?.message ||
      error.message;

    if (isAlreadySubmittedMessage(message)) {
      return;
    }

    throw error;
  }
};
