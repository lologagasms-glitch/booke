import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';

// Types
interface FileUploadProps {
  handleSave: (files: File[]) => Promise<void> | void;
  maxSize?: number;
  acceptedTypes?: string;
  isLoading: boolean;
  isSuccess: boolean;
}

export interface ProcessedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  uploaded: boolean;
}

const FileUploadModern: React.FC<FileUploadProps> = ({ 
  handleSave, 
  maxSize = 10 * 1024 * 1024,
  acceptedTypes = '*/*',
  isLoading,
  isSuccess,
}) => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Réinitialisation auto après succès
  useEffect(() => {
    if (isSuccess && !isLoading) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        clearAllFiles();
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isLoading]);

  const handleFileChange = async (selectedFiles: File[]): Promise<void> => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setIsUploading(true);
    setErrors([]);
    try {
      setRawFiles(prev => [...prev, ...selectedFiles]);
      const processedFiles: ProcessedFile[] = selectedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        uploaded: false
      }));
      setFiles(prevFiles => [...prevFiles, ...processedFiles]);
    } catch {
      setErrors(['Erreur lors du traitement des fichiers']);
    } finally {
      setIsUploading(false);
    }
  };

  const clearAllFiles = (): void => {
    setFiles([]);
    setRawFiles([]);
    setErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (indexToRemove: number): void => {
    setFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    setRawFiles(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles: File[] = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles: File[]): void => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];
    newFiles.forEach(file => {
      if (file.size > maxSize) {
        newErrors.push(`« ${file.name} » dépasse ${formatFileSize(maxSize)}`);
        return;
      }
      if (files.some(f => f.name === file.name && f.size === file.size)) {
        newErrors.push(`« ${file.name} » déjà ajouté`);
        return;
      }
      validFiles.push(file);
    });
    if (validFiles.length) handleFileChange(validFiles);
    if (newErrors.length) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 4000);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSaveClick = async () => {
    if (rawFiles.length) await handleSave(rawFiles);
  };

  return (
    <div className="w-full px-4 py-4 sm:px-6 sm:py-6">
      {showSuccess && (
        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-green-800 font-medium text-sm">Fichiers enregistrés !</span>
        </div>
      )}

      {/* Zone de drop / click */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-6 text-center
          transition-colors duration-200
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
          ${isUploading || isLoading ? 'opacity-70 pointer-events-none' : ''}
          ${showSuccess ? 'border-green-500 bg-green-50' : ''}
        `}
      >
        <input ref={fileInputRef} type="file" multiple onChange={handleFileInput} className="hidden" accept={acceptedTypes} />
        
        <div className="mb-3">
          {isLoading ? (
            <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          ) : showSuccess ? (
            <svg className="w-12 h-12 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg className={`w-12 h-12 mx-auto ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          )}
        </div>

        <p className="text-base font-semibold text-gray-800">
          {isLoading ? 'Enregistrement...' : isDragOver ? 'Lâchez ici' : 'Ajouter des images'}
        </p>
        <p className="text-xs text-gray-500 mt-1">Aucune limite • Max {formatFileSize(maxSize)}</p>
      </div>

      {/* Erreurs */}
      {errors.length > 0 && (
        <div className="mt-3 space-y-2">
          {errors.map((e, i) => (
            <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-2 text-sm text-red-700 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              {e}
            </div>
          ))}
        </div>
      )}

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">{files.length} fichier{files.length>1?'s':''}</h3>
            <button onClick={clearAllFiles} disabled={isLoading} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg active:scale-95 disabled:opacity-50">
              Tout suppr.
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {files.map((file, i) => (
              <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button onClick={() => removeFile(i)} disabled={isLoading} className="ml-2 p-1.5 text-gray-400 active:text-red-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>

          {/* Bouton Enregistrer */}
          <div className="mt-4">
            <button
              onClick={handleSaveClick}
              disabled={isLoading}
              className={`w-full px-4 py-3 text-sm font-semibold rounded-xl transition-colors
                ${isLoading ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white active:bg-blue-700'}`}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadModern;