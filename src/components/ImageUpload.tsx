import { FC, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';

// Sample image paths and descriptions
const sampleImages = [
  { path: "/samples/sample1.jpg", description: "sample1" },
  { path: "/samples/sample2.jpg", description: "sample2" },
  { path: "/samples/sample3.jpg", description: "sample3" },
];

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

  const handleSampleImage = async (imagePath: string) => {
    try {
      // Fetch the sample image
      const response = await fetch(imagePath);
      const blob = await response.blob();

      // Create a File object from the blob
      const file = new File([blob], `sample-${Date.now()}.jpg`, { type: 'image/jpeg' });

      // Process the image just like an uploaded file
      handleFile(file);

      toast({
        title: "Sample image selected",
        description: "Processing the selected sample image",
      });
    } catch (error) {
      console.error("Error loading sample image:", error);
      toast({
        title: "Error loading sample",
        description: "Failed to load the sample image. Please try another one.",
        variant: "destructive"
      });
    }
  };

  // Resize the image to 1280x1280 for optimal detection
  const resizeImage = (file: File): Promise<{ resizedFile: File, previewUrl: string }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas with the desired dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Set dimensions to 1280x1280 for optimal object detection
        canvas.width = 1280;
        canvas.height = 1280;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, 1280, 1280);

        // Get the data URL from the canvas
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob'));
              return;
            }

            // Create a new File instance
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            // Create preview URL from the resized image
            const previewUrl = URL.createObjectURL(blob);
            resolve({ resizedFile, previewUrl });
          },
          'image/jpeg',
          0.9
        );
      };

      img.onerror = () => {
        reject(new Error('Error loading image'));
      };

      img.src = URL.createObjectURL(file);
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
      // Resize the image to 1280x1280 for optimal bounding box accuracy
      const { resizedFile, previewUrl } = await resizeImage(file);

      // Pass the resized file and preview URL to the parent component
      onImageSelect(resizedFile, previewUrl);

      toast({
        title: "Image selected",
        description: "Your image has been resized to 1280x1280 for optimal analysis.",
      });
    } catch (error) {
      console.error("Error handling image:", error);
      toast({
        title: "Error processing image",
        description: "Failed to process your image. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Upload Your Own Image</h3>
          <form
            className="w-full"
            onDragEnter={handleDrag}
            onSubmit={(e) => e.preventDefault()}
          >
            <div
              className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl p-4 transition-colors ${
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
              <ImageIcon className="h-4 w-4" />
              Select Image
            </Button>
          </div>
        </div>

        {/* Sample Images Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Try Sample Images</h3>
          <div className="grid grid-cols-1 gap-3">
            {sampleImages.map((image, index) => (
              <div
                key={index}
                className="border rounded-lg p-2 flex items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => !isProcessing && handleSampleImage(image.path)}
              >
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={image.path}
                    alt={image.description}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm text-gray-700">{image.description}</p>
                  <p className="text-xs text-gray-500">Click to analyze</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Click on any sample to instantly analyze it
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
