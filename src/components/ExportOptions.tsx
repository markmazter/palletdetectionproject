
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ExportOptionsProps {
  imageUrl: string | null;
  predictions: any[] | null;
  totalCount: number;
}

const ExportOptions = ({ imageUrl, predictions }: ExportOptionsProps) => {
  const captureResults = async () => {
    const resultsElement = document.querySelector('.results-section');
    if (!resultsElement) return;
    
    try {
      const canvas = await html2canvas(resultsElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
      });
      
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `detection-results-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };

  if (!imageUrl || !predictions) return null;

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-2">Export Options</h3>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={captureResults}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Capture Results
        </Button>
      </div>
    </div>
  );
};

export default ExportOptions;
