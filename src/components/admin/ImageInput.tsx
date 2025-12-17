import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';

// Types
interface FileUploadProps {
  handleSave: (files: File[]) => Promise<void> | void;
  maxFiles?: number;
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
  maxFiles = 10, 
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

  // Effacer automatiquement les fichiers après un succès
  useEffect(() => {
    if (isSuccess && !isLoading && files.length > 0) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        clearAllFiles();
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isLoading, files.length]);

  const handleFileChange = async (selectedFiles: File[]): Promise<void> => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    setErrors([]);

    try {
      setRawFiles(prev => [...prev, ...selectedFiles]);

      const processedFiles: ProcessedFile[] = selectedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        uploaded: false
      }));

      setFiles(prevFiles => [...prevFiles, ...processedFiles]);
    } catch (error) {
      setErrors(['Erreur lors du traitement des fichiers']);
    } finally {
      setIsUploading(false);
    }
  };

  const clearAllFiles = (): void => {
    setFiles([]);
    setRawFiles([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (indexToRemove: number): void => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    const updatedRawFiles = rawFiles.filter((_, index) => index !== indexToRemove);
    
    setFiles(updatedFiles);
    setRawFiles(updatedRawFiles);
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
        newErrors.push(`Le fichier "${file.name}" dépasse la taille maximale de ${formatFileSize(maxSize)}`);
        return;
      }

      if (files.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
        newErrors.push(`Le fichier "${file.name}" est déjà ajouté`);
        return;
      }

      validFiles.push(file);
    });

    if (files.length + validFiles.length > maxFiles) {
      newErrors.push(`Vous ne pouvez pas ajouter plus de ${maxFiles} fichiers`);
      return;
    }

    if (validFiles.length > 0) {
      handleFileChange(validFiles);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 5000);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k: number = 1024;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB'];
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSaveClick = async () => {
    if (rawFiles.length > 0) {
      await handleSave(rawFiles);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {showSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium">Fichiers enregistrés avec succès !</span>
          </div>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-300 ease-in-out transform hover:scale-[1.02] backdrop-blur-sm
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50/80 scale-[1.02] shadow-lg shadow-blue-500/20' 
            : 'border-gray-300 hover:border-gray-400 bg-white/80'
          }
          ${isUploading || isLoading ? 'opacity-75 pointer-events-none' : ''}
          ${showSuccess ? 'border-green-500 bg-green-50/80' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept={acceptedTypes}
        />
        
        <div className="mb-4">
          {isLoading ? (
            <div className="relative">
              <svg className="w-16 h-16 mx-auto text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : showSuccess ? (
            <svg className="w-16 h-16 mx-auto text-green-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg
              className={`w-16 h-16 mx-auto transition-all duration-300 ${
                isDragOver ? 'text-blue-500 scale-110' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-800">
            {isLoading ? 'Enregistrement en cours...' : 
             showSuccess ? 'Succès !' :
             isDragOver ? 'Lâchez vos fichiers ici' : 'Glissez-déposez vos fichiers ici'}
          </p>
          <p className="text-sm text-gray-600">
            ou <span className="text-blue-600 font-semibold underline decoration-2">cliquez pour parcourir</span>
          </p>
          <p className="text-xs text-gray-500 font-medium">
            Maximum {maxFiles} fichiers • {formatFileSize(maxSize)} par fichier
          </p>
        </div>

        {/* Effet de scan */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className={`
            absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
            translate-x-[-100%] ${isDragOver ? 'translate-x-[100%]' : ''}
            transition-transform duration-1000 ease-in-out
          `} />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 animate-pulse">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
            </h3>
            <button
              onClick={clearAllFiles}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg
                       hover:bg-red-100 transition-all duration-200 disabled:opacity-50
                       disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              Tout supprimer
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {files.map((file, index) => (
              <div
                key={file.id}
                className={`
                  flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                  ${showSuccess ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}
                  hover:shadow-md hover:scale-[1.01] group
                `}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                    ${showSuccess ? 'bg-green-100' : 'bg-blue-100'}
                  `}>
                    {showSuccess ? (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  disabled={isLoading}
                  className="flex-shrink-0 ml-4 p-2 text-gray-400 hover:text-red-600 
                           hover:bg-red-50 rounded-lg transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           group-hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveClick}
            disabled={isLoading || isSuccess}
            className={`
              px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300
              ${isLoading || isSuccess 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95'}
            `}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </span>
            ) : isSuccess ? (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Succès !
              </span>
            ) : (
              'Enregistrer'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadModern;