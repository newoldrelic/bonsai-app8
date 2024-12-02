import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { MaintenanceType } from '../types';
import { ImageUpload } from './ImageUpload';
import { MaintenanceTypeIcon } from './MaintenanceTypeIcon';

interface MaintenanceLogFormProps {
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

interface FormData {
  type: MaintenanceType;
  date: string;
  notes: string;
  images: string[];
}

const MAINTENANCE_TYPES: MaintenanceType[] = [
  'watering',
  'fertilizing',
  'pruning',
  'wiring',
  'repotting',
  'other'
];

const MAX_IMAGE_SIZE = 800;

export function MaintenanceLogForm({ onClose, onSubmit }: MaintenanceLogFormProps) {
  const [formData, setFormData] = useState<FormData>({
    type: 'watering',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    images: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > MAX_IMAGE_SIZE) {
          height = (height * MAX_IMAGE_SIZE) / width;
          width = MAX_IMAGE_SIZE;
        } else if (height > MAX_IMAGE_SIZE) {
          width = (width * MAX_IMAGE_SIZE) / height;
          height = MAX_IMAGE_SIZE;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        const resizedImage = canvas.toDataURL('image/jpeg', 0.7);
        URL.revokeObjectURL(img.src);
        resolve(resizedImage);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
    });
  };

  const handleImageCapture = async (file: File) => {
    try {
      setLoading(true);
      const resizedImage = await resizeImage(file);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, resizedImage]
      }));
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again with a different photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-3 border-b border-stone-200 dark:border-stone-700 sticky top-0 bg-white dark:bg-stone-800 z-10">
          <h2 className="text-lg font-semibold text-bonsai-bark dark:text-white">Add Maintenance Log</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Maintenance Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MAINTENANCE_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type }))}
                  className={`flex items-center justify-center space-x-2 p-2 rounded-lg border-2 transition-colors ${
                    formData.type === type
                      ? 'border-bonsai-green bg-bonsai-green/10 text-bonsai-green'
                      : 'border-stone-200 dark:border-stone-700 hover:border-bonsai-green/50'
                  }`}
                >
                  <MaintenanceTypeIcon type={type} className="w-4 h-4" />
                  <span className="text-sm capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green"
              placeholder="Add any maintenance notes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Photos
            </label>
            <div className="space-y-3">
              <ImageUpload onImageCapture={handleImageCapture} />
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Maintenance photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <MaintenanceTypeIcon type={formData.type} className="w-4 h-4 text-white" />
            <span>{loading ? 'Processing...' : 'Add Maintenance Log'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}