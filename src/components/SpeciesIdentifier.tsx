import React, { useState } from 'react';
import { Loader2, TreeDeciduous, AlertCircle, Search } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface SpeciesIdentifierProps {
  onSpeciesIdentified: (species: string) => void;
}

export function SpeciesIdentifier({ onSpeciesIdentified }: SpeciesIdentifierProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageCapture = async (file: File) => {
    setError(null);
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Error reading file:', err);
      setError('Failed to load image preview');
    }
  };

  const handleAnalyze = async () => {
    if (!previewImage) return;

    setLoading(true);
    setError(null);
    setStatus('Analyzing image with AI...');

    try {
      const response = await fetch('/.netlify/functions/identify-species', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: previewImage })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.species) {
        throw new Error('No species identification received');
      }

      setStatus('Species identified successfully!');
      onSpeciesIdentified(data.species);
      setPreviewImage(null); // Clear preview after successful identification
    } catch (err: any) {
      console.error('Species identification error:', err);
      setError(err.message || 'Failed to identify species. Please try again.');
    } finally {
      setLoading(false);
      if (!error) {
        setTimeout(() => setStatus(''), 2000);
      }
    }
  };

  return (
    <div className="space-y-4">
      {!previewImage ? (
        <ImageUpload onImageCapture={handleImageCapture} />
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={previewImage}
              alt="Bonsai preview"
              className="w-full h-64 object-contain rounded-lg border border-stone-200 dark:border-stone-700"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Analyze Bonsai</span>
          </button>
        </div>
      )}

      {(loading || status) && (
        <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-bonsai-green/5 rounded-lg">
          <div className="flex items-center space-x-2 text-bonsai-green">
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{status || 'Processing...'}</span>
          </div>
          {loading && (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              This may take a few moments
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-start space-x-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              Species Identification Failed
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}