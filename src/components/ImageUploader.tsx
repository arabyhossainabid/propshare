'use client';

import { useImageUpload } from '@/hooks/useImageUpload';
import { AlertCircle, Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from './ui/button';

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  previewHeight?: number;
  previewWidth?: number;
}

export function ImageUploader({
  onImageUpload,
  label = 'Upload Image',
  placeholder = 'Drag and drop or click to upload',
  className = '',
  previewHeight = 200,
  previewWidth = 300,
}: ImageUploaderProps) {
  const {
    isLoading,
    error,
    previewUrl,
    uploadedUrl,
    handleFileSelect,
    handleUpload,
    clearPreview,
    clearError,
  } = useImageUpload();
  const [inputKey, setInputKey] = useState(0);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
      clearError();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileSelect(file);
      clearError();
    }
  };

  const handleConfirmUpload = async () => {
    try {
      const url = await handleUpload();
      onImageUpload(url);
      // Reset form
      setInputKey((prev) => prev + 1);
      clearPreview();
    } catch (err) {
      // Error is already set in hook
      console.error('Upload error:', err);
    }
  };

  const handleCancel = () => {
    clearPreview();
    clearError();
    setInputKey((prev) => prev + 1);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}

      {!previewUrl && !uploadedUrl && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className='relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 hover:bg-blue-50'
        >
          <input
            key={inputKey}
            type='file'
            accept='image/*'
            onChange={handleInputChange}
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
            disabled={isLoading}
          />
          <div className='flex flex-col items-center gap-2'>
            <Upload className='w-8 h-8 text-gray-400' />
            <p className='text-sm text-gray-600'>{placeholder}</p>
            <p className='text-xs text-gray-500'>
              Max 5MB • JPG, PNG, WebP, GIF
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className='flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700'>
          <AlertCircle className='w-5 h-5 flex-shrink-0' />
          <span className='text-sm'>{error}</span>
        </div>
      )}

      {previewUrl && !uploadedUrl && (
        <div className='space-y-3'>
          <div className='relative rounded-lg overflow-hidden bg-gray-100'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt='Preview'
              style={{ width: previewWidth, height: previewHeight }}
              className='object-cover w-full'
            />
          </div>

          <div className='flex gap-3'>
            <Button
              onClick={handleConfirmUpload}
              disabled={isLoading}
              className='flex-1 bg-white/10 hover:bg-white/15'
            >
              {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              {isLoading ? 'Uploading...' : 'Confirm Upload'}
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              variant='outline'
              className='flex-1'
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {uploadedUrl && (
        <div className='space-y-3'>
          <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
            <p className='text-sm text-green-700 font-medium'>
              Image uploaded successfully! ✓
            </p>
            <p className='text-xs text-green-600 mt-1 break-all'>
              {uploadedUrl}
            </p>
          </div>

          <div className='relative rounded-lg overflow-hidden bg-gray-100'>
            <Image
              src={uploadedUrl}
              alt='Uploaded'
              width={previewWidth}
              height={previewHeight}
              className='object-cover w-full'
            />
          </div>

          <div className='flex gap-3'>
            <Button onClick={handleCancel} variant='outline' className='flex-1'>
              <X className='w-4 h-4 mr-2' />
              Upload Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
