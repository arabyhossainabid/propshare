import { api } from './api';

interface UploadApiError {
  message?: string;
}

const uploadViaCloudinaryUnsigned = async (
  file: File
): Promise<string | null> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return null;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    const cloudinaryMessage =
      errorPayload?.error?.message ||
      `Cloudinary upload failed (${response.status})`;
    throw new Error(cloudinaryMessage);
  }

  const payload = (await response.json()) as { secure_url?: string };
  return payload.secure_url || null;
};

const extractImageUrl = (payload: unknown): string | null => {
  if (typeof payload === 'string') return payload;

  if (!payload || typeof payload !== 'object') return null;

  const root = payload as {
    url?: unknown;
    data?: { url?: unknown };
  };

  if (typeof root.url === 'string') return root.url;
  if (typeof root.data?.url === 'string') return root.data.url;

  if (root.data && typeof root.data === 'object') {
    const dataStr = JSON.stringify(root.data);
    const urlMatch = dataStr.match(/(https?:\/\/[^\s"]+)/);
    if (urlMatch) return urlMatch[1];
  }

  return null;
};

/**
 * File validation constraints
 */
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
};

/**
 * Validate file before upload
 */
export function validateUploadFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file size
  if (file.size > UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  // Check file type
  if (!UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (
    !extension ||
    !UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)
  ) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Upload image to backend (which uploads to Cloudinary)
 */
export async function uploadImage(file: File): Promise<string> {
  // Validate file first
  const validation = validateUploadFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'File validation failed');
  }

  console.log('[Upload] Starting file upload:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  // Try direct Cloudinary unsigned upload first if configured.
  try {
    const cloudinaryUrl = await uploadViaCloudinaryUnsigned(file);
    if (cloudinaryUrl) {
      return cloudinaryUrl;
    }
  } catch {
    // Fall back to backend upload endpoint.
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload', formData);
    const imageUrl = extractImageUrl(response.data);

    if (!imageUrl) {
      throw new Error('No image URL returned from server');
    }

    return imageUrl;
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: UploadApiError };
      message?: string;
    };

    const status = err.response?.status;
    const message =
      err.response?.data?.message || err.message || 'Failed to upload image';

    if (status === 500) {
      try {
        const cloudinaryUrl = await uploadViaCloudinaryUnsigned(file);
        if (cloudinaryUrl) {
          return cloudinaryUrl;
        }
      } catch (cloudinaryError) {
        const cloudinaryMessage =
          cloudinaryError instanceof Error
            ? cloudinaryError.message
            : 'Cloudinary fallback upload failed';

        throw new Error(
          `Upload API failed (500). Backend upload handler has an internal error. Cloudinary fallback also failed: ${cloudinaryMessage}`
        );
      }

      throw new Error(
        'Upload API failed (500). Backend upload handler has an internal error. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET for direct fallback upload.'
      );
    }

    throw new Error(message);
  }
}

/**
 * Generate preview URL from File object
 */
export function generatePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke object URL to free memory
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
