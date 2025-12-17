// hooks/useFileUpload.ts
import { useMutation } from '@tanstack/react-query';
import { usePopup } from '../popup';

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    urls: string[];
    files: Array<{
      name: string;
      size: number;
      type: string;
      url: string;
      savedAs: string;
      directory: string;
    }>;
    directory: string;
  };
}

export interface UploadError {
  message: string;
  errors?: string[];
}

// ✅ Interface pour les paramètres de mutation
interface UploadParams {
  files: File[];
  nom: string;
  id: string;
  nomParent?: string;
  type: string;
}

const uploadFiles = async ({ files, nom, id, nomParent = "", type }: UploadParams): Promise<UploadResponse> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  formData.append('nom', nom);
  formData.append('id', id);
  formData.append('parent', nomParent);
  formData.append('type', type);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de l\'upload des fichiers');
  }

  return response.json();
};

export const useFileUpload = () => {
  const mutation = useMutation<UploadResponse, UploadError, UploadParams>({
    mutationFn: uploadFiles,
    onSuccess: (data) => {
      console.log('Upload réussi:', data);
    },
    onError: (error) => {
      console.error('Erreur upload:', error);
    },
  });

  // ✅ Extraction de toutes les variables utiles
  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    isError,
    isSuccess,
    isIdle,
    error,
    data,
    reset,
    status,
    failureCount,
    failureReason,
  } = mutation;

  return {
    // ✅ Fonctions
    mutate,
    mutateAsync,
    reset,
    
    // ✅ États de chargement
    isLoading,      // Alias de isPending (plus clair)
    isPending: isLoading, // Pour compatibilité
    isError,
    isSuccess,
    isIdle,
    
    // ✅ Données et erreur
    data,
    error,
    status,
    
    // ✅ Informations détaillées
    failureCount,
    failureReason,
  };
};

// ✅ Hook alternatif avec options personnalisées
export const useFileUploadWithOptions = () => {
  const mutation = useMutation({
    mutationFn: uploadFiles,
    onSuccess: (data) => {
      console.log('Upload réussi:', data);
    },
    onError: (error) => {
      console.error('Erreur upload:', error);
    },
    retry: 3, // ✅ Retry 3 fois en cas d'échec
    retryDelay: 1000, // ✅ Délai de 1 seconde entre les retries
  });

  return {
    ...mutation,
    
  };
};