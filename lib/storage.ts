import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET_NAME = 'application-photos';

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param folder - The folder path (e.g., 'headshots', 'portfolios')
 * @returns The public URL of the uploaded file, or null on failure
 */
export async function uploadFile(
  file: File,
  folder: string = 'uploads'
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, skipping file upload');
    return { url: null, error: 'Storage not configured' };
  }

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${timestamp}-${randomId}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    console.error('Upload exception:', err);
    return { url: null, error: message };
  }
}

/**
 * Upload a base64 image to Supabase Storage
 * @param base64Data - Base64 encoded image data (with or without data URL prefix)
 * @param folder - The folder path
 * @param filename - Optional filename (without extension)
 * @returns The public URL of the uploaded file, or null on failure
 */
export async function uploadBase64Image(
  base64Data: string,
  folder: string = 'uploads',
  filename?: string
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning base64 as-is');
    // Return the base64 data as URL for mock mode
    return { url: base64Data, error: null };
  }

  try {
    // Extract mime type and data from base64 string
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return { url: null, error: 'Invalid base64 format' };
    }

    const mimeType = matches[1];
    const base64 = matches[2];

    // Get file extension from mime type
    const ext = mimeType.split('/')[1] || 'png';

    // Convert base64 to blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Create file from blob
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const finalFilename = filename || `${timestamp}-${randomId}`;
    const file = new File([blob], `${finalFilename}.${ext}`, { type: mimeType });

    // Use the regular upload function
    return uploadFile(file, folder);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Base64 upload failed';
    console.error('Base64 upload exception:', err);
    return { url: null, error: message };
  }
}

/**
 * Delete a file from Supabase Storage
 * @param url - The public URL of the file to delete
 * @returns Success status
 */
export async function deleteFile(url: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    // Extract path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
    if (pathParts.length !== 2) {
      return false;
    }

    const filePath = pathParts[1];
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete exception:', err);
    return false;
  }
}
