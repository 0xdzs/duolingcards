import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Pass file to parent
      onImageUpload(file);
      
      // Clean up preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50'}`}
    >
      <input {...getInputProps()} />
      
      {preview ? (
        <div className="relative">
          <button 
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
          >
            <X size={16} />
          </button>
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-64 mx-auto rounded-md" 
          />
          <p className="mt-2 text-sm text-gray-500">Click or drag to replace</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-center">
            {isDragActive ? (
              <ImageIcon className="h-12 w-12 text-green-500" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop the image here' : 'Upload Duolingo screenshot'}
          </p>
          <p className="text-sm text-gray-500">
            Drag and drop, or click to select
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
