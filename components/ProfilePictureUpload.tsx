import React, { useRef, useState } from 'react';

interface ProfilePictureUploadProps {
  onPicturesChange: (pictures: string[]) => void;
  maxPictures?: number;
  existingPictures?: string[];
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  onPicturesChange, 
  maxPictures = 2,
  existingPictures = []
}) => {
  const [pictures, setPictures] = useState<string[]>(existingPictures);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const newPictures: string[] = [...pictures];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && newPictures.length < maxPictures) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            newPictures.push(result);
            setPictures(newPictures);
            onPicturesChange(newPictures);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removePicture = (index: number) => {
    const newPictures = pictures.filter((_, i) => i !== index);
    setPictures(newPictures);
    onPicturesChange(newPictures);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-dark-400 mb-2">
        Profile Pictures (Optional - max {maxPictures})
      </label>
      
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: maxPictures }).map((_, index) => (
          <div
            key={index}
            className={`relative aspect-square rounded-lg border-2 border-dashed transition-all ${
              dragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-dark-600 hover:border-dark-500'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            {pictures[index] ? (
              <div className="relative w-full h-full">
                <img
                  src={pictures[index]}
                  alt={`Profile ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePicture(index);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center text-xs hover:bg-danger/90 transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-dark-400 cursor-pointer">
                <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-xs text-center">
                  {index === 0 ? 'Add Face 1' : 'Add Face 2'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {pictures.length > 0 && (
        <p className="text-xs text-dark-400">
          ✨ Profile pictures will be incorporated into the AI-generated poster
        </p>
      )}
    </div>
  );
};
