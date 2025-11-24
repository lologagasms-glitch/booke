'use client';

import { useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  onUpload: (imageUrls: string[]) => void;
}

const ImageUpload = ({ onUpload }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (files: FileList) => {
    setIsUploading(true);
    
    // In a real app, you would upload these files to your server or a service like Cloudinary
    // For this demo, we'll simulate the upload and return placeholder URLs
    setTimeout(() => {
      const uploadedUrls = Array.from(files).map(() => '/file.svg');
      onUpload(uploadedUrls);
      setIsUploading(false);
    }, 1500);
  };
  
  return (
    <div>
      <div 
        className={`border-2 border-dashed rounded-md p-6 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-700 hover:text-blue-500">
              <span>Télécharger des fichiers</span>
              <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                multiple 
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
            <p className="pl-1">ou glisser-déposer</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
        </div>
      </div>
      
      {isUploading && (
        <div className="mt-3 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-700 mr-2"></div>
          <span className="text-sm text-gray-600">Téléchargement en cours...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;