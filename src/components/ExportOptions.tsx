
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileImage, Download, File } from 'lucide-react';

interface ExportOptionsProps {
  imageUrl: string | null;
  predictions: any[] | null;
  totalCount: number;
}

const ExportOptions = ({ imageUrl, predictions, totalCount }: ExportOptionsProps) => {
  const downloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `detected-objects-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadResults = () => {
    if (!predictions) return;
    
    const results = {
      timestamp: new Date().toISOString(),
      totalCount,
      predictions
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `detection-results-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!imageUrl || !predictions) return null;

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-2">Export Options</h3>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={downloadImage}
          className="flex items-center gap-2"
        >
          <FileImage className="h-4 w-4" />
          Download Image
        </Button>
        <Button 
          variant="outline" 
          onClick={downloadResults}
          className="flex items-center gap-2"
        >
          <File className="h-4 w-4" />
          Download Results
        </Button>
      </div>
    </div>
  );
};

export default ExportOptions;
