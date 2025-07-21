# Sistema de Upload de Imagens

Este documento explica como usar o sistema de upload de imagens implementado no Portal do Saber.

## Estrutura

### API Routes
- **POST** `/api/upload` - Faz upload de uma imagem
- **DELETE** `/api/upload?fileName=nome_do_arquivo` - Deleta uma imagem

### Componentes
- `ImageUpload` - Componente para upload com drag & drop
- `useImageUpload` - Hook para gerenciar uploads

### Diretórios
- `public/uploads/images/` - Onde as imagens são armazenadas

## Como Usar

### 1. Upload Básico
```tsx
import ImageUpload from '@/components/ImageUpload';

<ImageUpload
  value={imagemUrl}
  onChange={(url) => setImagemUrl(url)}
  altValue={altText}
  onAltChange={(alt) => setAltText(alt)}
/>
```

### 2. Com Hook Personalizado
```tsx
import { useImageUpload } from '@/hooks/useImageUpload';

const { uploadImage, deleteImage, isUploading, error } = useImageUpload();

const handleUpload = async (file: File) => {
  const result = await uploadImage(file);
  if (result) {
    console.log('Upload realizado:', result.url);
  }
};
```

### 3. Upload Manual via API
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
```

## Validações

### Tipos de Arquivo Permitidos
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Tamanho Máximo
- 5MB por arquivo

### Segurança
- Validação de tipo MIME
- Sanitização do nome do arquivo
- Geração de nomes únicos com timestamp

## Estrutura de Resposta da API

### Upload Bem-sucedido
```json
{
  "message": "Upload realizado com sucesso!",
  "url": "/uploads/images/1640123456789_imagem.jpg",
  "fileName": "1640123456789_imagem.jpg"
}
```

### Erro
```json
{
  "error": "Tipo de arquivo não permitido. Apenas JPEG, PNG, GIF e WebP são aceitos."
}
```

## Funcionalidades do Componente ImageUpload

### Drag & Drop
- Arraste arquivos diretamente para a área de upload
- Feedback visual durante o drag

### Preview
- Visualização imediata da imagem
- Botão de exclusão no preview

### Input Manual
- Opção de inserir URL manualmente
- Útil para imagens externas

### Upload Progressivo
- Indicador de loading durante upload
- Tratamento de erros

## Exemplo Completo

```tsx
import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function MeuFormulario() {
  const [imagemUrl, setImagemUrl] = useState('');
  const [altText, setAltText] = useState('');

  return (
    <form>
      <ImageUpload
        value={imagemUrl}
        onChange={(url) => setImagemUrl(url)}
        altValue={altText}
        onAltChange={(alt) => setAltText(alt)}
      />
      
      {imagemUrl && (
        <p>Imagem selecionada: {imagemUrl}</p>
      )}
    </form>
  );
}
```

## Configuração do Next.js

O arquivo `next.config.ts` está configurado para:
- Permitir uploads até 10MB
- Otimizar imagens do domínio local
- Permitir imagens de URLs externas

## Considerações de Produção

### Armazenamento
- Em produção, considere usar serviços como AWS S3, Cloudinary ou Vercel Blob
- O diretório `public/uploads` é adequado apenas para desenvolvimento

### CDN
- Para melhor performance, use um CDN para servir as imagens
- Configure o Next.js Image Optimization

### Backup
- Implemente rotinas de backup para as imagens
- Considere versionamento de arquivos
