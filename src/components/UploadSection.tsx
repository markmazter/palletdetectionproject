
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ImageUpload from './ImageUpload';
import ResultsDisplay from './ResultsDisplay';
import ExportOptions from './ExportOptions';
import HistoryLog from './HistoryLog';
import ModelVersionSelector from './ModelVersionSelector';
import { analyzeImage, formatPredictions } from '@/services/roboflowService';
import { API_KEY, MODEL_ID } from '@/config/constants';
import type { HistoryEntry } from '@/types/history';

const UploadSection = () => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelVersion, setModelVersion] = useState('2');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleImageSelect = async (file: File, previewUrl: string) => {
    setSelectedImage(file);
    setImagePreview(previewUrl);
    setPredictions(null);
    
    try {
      setIsProcessing(true);
      const results = await analyzeImage(file, API_KEY, MODEL_ID, modelVersion);
      const formattedPredictions = formatPredictions(results);
      setPredictions(formattedPredictions);
      
      const historyEntry: HistoryEntry = {
        id: new Date().getTime().toString(),
        timestamp: new Date().toISOString(),
        imageUrl: previewUrl,
        totalCount: results.predictions.length,
        modelVersion: modelVersion,
        predictions: formattedPredictions
      };
      setHistory(prev => [historyEntry, ...prev]);
      
      toast({
        title: "Analysis complete!",
        description: `Detected ${results.predictions.length} objects in the image.`
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error processing your image. Please check and try again.",
        variant: "destructive"
      });
      setPredictions([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setImagePreview(entry.imageUrl);
    setModelVersion(entry.modelVersion);
    setPredictions(entry.predictions);
    toast({
      title: "Loaded from history",
      description: `Showing analysis from ${new Date(entry.timestamp).toLocaleString()}`
    });
  };

  const handleVersionSelect = (version: string) => {
    setModelVersion(version);
    toast({
      title: "Model version changed",
      description: `Now using version ${version} with ${MODEL_PRECISION[version]} precision.`,
    });
  };

  return (
    <section id="upload-section" className="py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Your Image</h2>
        
        <ModelVersionSelector 
          currentVersion={modelVersion}
          onVersionSelect={handleVersionSelect}
        />
        
        <ImageUpload 
          onImageSelect={handleImageSelect} 
          isProcessing={isProcessing} 
        />
        
        <div className="space-y-6">
          <ResultsDisplay 
            imageUrl={imagePreview}
            predictions={predictions}
            isProcessing={isProcessing}
          />
          
          {predictions && predictions.length > 0 && (
            <ExportOptions 
              imageUrl={imagePreview}
              predictions={predictions}
              totalCount={predictions.length}
            />
          )}
          
          <HistoryLog 
            entries={history}
            onSelectEntry={handleHistorySelect}
          />
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
