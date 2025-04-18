
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import html2canvas from 'html2canvas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ExportOptionsProps {
  imageUrl: string | null;
  predictions: any[] | null;
  totalCount: number;
}

const ExportOptions = ({ imageUrl, predictions }: ExportOptionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const captureResults = async () => {
    const resultsElement = document.querySelector('.results-section') as HTMLElement;
    if (!resultsElement) {
      toast({
        title: "Error",
        description: "Could not find results section to capture",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const canvas = await html2canvas(resultsElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
      });
      
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName || 'detection-results'}-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Results captured and downloaded successfully"
      });
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast({
        title: "Error",
        description: "Failed to capture results",
        variant: "destructive"
      });
    }
  };

  if (!imageUrl || !predictions) return null;

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-2">Export Options</h3>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Capture Results
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Results</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="fileName" className="block text-sm font-medium mb-2">
              File Name
            </label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={captureResults}>
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExportOptions;
