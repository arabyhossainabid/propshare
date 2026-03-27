'use client';

import { revokePreviewUrl, uploadImage } from '@/lib/upload';
import { useCallback, useState } from 'react';

interface UseImageUploadReturn {
  isLoading: boolean;
  error: string | null;
  previewUrl: string | null;
  uploadedUrl: string | null;
  handleFileSelect: (file: File) => Promise<void>;
  handleUpload: () => Promise<string>;
  clearPreview: () => void;
  clearError: () => void;
  reset: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setSelectedFile(file);

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadedUrl(null);
  }, []);

  const handleUpload = useCallback(async (): Promise<string> => {
    if (!selectedFile) {
      const err = 'No file selected';
      setError(err);
      throw new Error(err);
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = await uploadImage(selectedFile);
      setUploadedUrl(url);
      return url;
    } catch (err: unknown) {
      const error = err as Error;
      const errMsg = error.message || 'Upload failed';
      setError(errMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      revokePreviewUrl(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadedUrl(null);
  }, [previewUrl]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    clearPreview();
    clearError();
    setIsLoading(false);
  }, [clearPreview, clearError]);

  return {
    isLoading,
    error,
    previewUrl,
    uploadedUrl,
    handleFileSelect,
    handleUpload,
    clearPreview,
    clearError,
    reset,
  };
}
