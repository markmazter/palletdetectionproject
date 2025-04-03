
import { FC, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Upload, Image } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File, previewUrl: string) => void;
  isProcessing: boolean;
}

const ImageUpload: FC<ImageUploadProps> = ({ onImageSelect, isProcessing }) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement | HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        handleFile(file);
      }
    },
    [onImageSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const resizeImage = (file: File): Promise<{ resizedFile: File; previewUrl: string }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas dimensions to 640x640
          canvas.width = 640;
          canvas.height = 640;
          
          if (ctx) {
            // Draw the image on the canvas, resizing it to 640x640
            ctx.drawImage(img, 0, 0, 640, 640);
            
            // Convert the canvas to a blob
            canvas.toBlob((blob) => {
              if (blob) {
                // Create a new file from the blob
                const resizedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now()
                });
                
                // Create a data URL for preview
                const previewUrl = canvas.toDataURL(file.type);
                
                resolve({ resizedFile, previewUrl });
              } else {
                reject(new Error('Failed to create blob from canvas'));
              }
            }, file.type);
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    try {
      // Resize the image to 640x640
      const { resizedFile, previewUrl } = await resizeImage(file);
      
      // Pass the resized file and preview URL to the parent component
      onImageSelect(resizedFile, previewUrl);
      
      toast({
        title: "Image resized",
        description: "Your image has been resized to 640x640 for optimal detection",
      });
    } catch (error) {
      console.error("Error resizing image:", error);
      toast({
        title: "Error processing image",
        description: "Failed to resize your image. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full">
      <form
        className="w-full"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <div
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl p-4 transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleChange}
            disabled={isProcessing}
          />
          
          <div className="flex flex-col items-center justify-center space-y-3">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                <p className="text-sm font-medium text-gray-500">Processing...</p>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-blue-50">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <p className="font-medium text-gray-700">Drag & drop your image here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
                <p className="text-xs text-gray-400 mt-2">Supports: JPEG, PNG, WebP</p>
              </>
            )}
          </div>
        </div>
      </form>

      <div className="mt-4 flex justify-center">
        <Button 
          disabled={isProcessing}
          onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
          className="flex items-center gap-2"
        >
          <Image className="h-4 w-4" />
          Select Image
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
