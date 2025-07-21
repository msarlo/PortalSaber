import { useState, useRef } from 'react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, alt?: string) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
}

export default function ImageUpload({ value, onChange, altValue, onAltChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
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
        onChange(result.url);
        // Auto-gerar alt text baseado no nome do arquivo
        if (onAltChange && !altValue) {
          const altText = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
          onAltChange(altText);
        }
      } else {
        setError(result.error || 'Erro no upload');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDelete = async () => {
    if (!value) return;

    try {
      const fileName = value.split('/').pop();
      const response = await fetch(`/api/upload?fileName=${fileName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onChange('');
        if (onAltChange) onAltChange('');
      }
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block font-medium">Imagem</label>
        
        {/* Preview da imagem */}
        {value && (
          <div className="relative inline-block">
            <img 
              src={value} 
              alt={altValue || "Preview"} 
              className="max-w-xs max-h-40 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={handleDelete}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Área de upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600">Fazendo upload...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Clique para selecionar
                </button>
                <span className="text-gray-600"> ou arraste uma imagem aqui</span>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP até 5MB</p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Input de arquivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Input manual de URL (opcional) */}
        <div className="pt-2 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ou inserir URL manualmente:
          </label>
          <input
            type="text"
            placeholder="https://exemplo.com/imagem.jpg"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Input para texto alternativo */}
      {onAltChange && (
        <div>
          <label className="block font-medium">Texto alternativo (alt)</label>
          <input
            type="text"
            placeholder="Descrição da imagem para acessibilidade"
            value={altValue || ''}
            onChange={(e) => onAltChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      )}
    </div>
  );
}
