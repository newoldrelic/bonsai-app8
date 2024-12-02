import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageCapture: (file: File) => void;
}

export function ImageUpload({ onImageCapture }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      // Max size 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }
      onImageCapture(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`flex ${isMobile ? 'gap-4' : 'justify-center'}`}>
        {isMobile && (
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-bonsai-green text-white rounded-lg hover:bg-bonsai-moss transition-colors"
          >
            <Camera className="w-5 h-5" />
            <span>Take Photo</span>
          </button>
        )}
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`${isMobile ? 'flex-1' : 'w-48'} flex items-center justify-center space-x-2 px-4 py-2 border-2 border-bonsai-green text-bonsai-green rounded-lg hover:bg-bonsai-green hover:text-white transition-colors`}
        >
          <Upload className="w-5 h-5" />
          <span>Upload Photo</span>
        </button>
      </div>

      {/* Regular file upload input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Camera input - only for mobile */}
      {isMobile && (
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      )}
    </div>
  );
}