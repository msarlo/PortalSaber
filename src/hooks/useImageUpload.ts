import { useState } from 'react';

interface UploadResult {
  url: string;
  fileName: string;
  message: string;
}

interface UploadError {
  error: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<UploadResult | null> => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        return result as UploadResult;
      } else {
        setError(result.error || 'Erro no upload');
        return null;
      }
    } catch (err) {
      setError('Erro de conexão');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (fileName: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/upload?fileName=${fileName}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading,
    error,
    clearError: () => setError(null),
  };
}
