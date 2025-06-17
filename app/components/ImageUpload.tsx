// app/components/ImageUpload.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  loading: boolean;
}

export default function ImageUpload({ onUpload, loading }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    
    // Handle file rejections
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File is too large. Maximum size is 5MB.');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload PNG, JPG, or JPEG files only.');
      } else {
        setError('File upload failed. Please try again.');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      
      // Send to parent component
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: loading
  });

  const clearPreview = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* Simple Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${loading ? 'pointer-events-none opacity-50' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Upload Icon */}
        <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
            />
          </svg>
        </div>

        {/* Upload Text */}
        {loading ? (
          <div>
            <p className="text-gray-600 font-medium">Analyzing your chart...</p>
            <div className="mt-2 w-8 h-8 mx-auto">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : error ? (
          <div>
            <p className="text-red-600 font-medium">Upload Failed</p>
            <p className="text-red-500 text-sm">{error}</p>
            <p className="text-gray-500 text-xs mt-2">Click to try again</p>
          </div>
        ) : isDragActive ? (
          <div>
            <p className="text-blue-600 font-medium">Drop your chart here!</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 font-medium mb-2">
              Drag & drop your trading chart here, or click to browse
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
              Select Image
            </button>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {preview && !loading && (
        <div className="mt-4 bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-700">Chart Preview</h3>
            <button
              onClick={clearPreview}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Remove
            </button>
          </div>
          <div className="relative">
            <img 
              src={preview} 
              alt="Chart preview" 
              className="max-h-64 w-full object-contain rounded border bg-gray-50"
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}