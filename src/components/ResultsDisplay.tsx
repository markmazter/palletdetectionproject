import { FC, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, Layers, Text, EyeOff, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Prediction {
  class: string;
  confidence: number;
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface ResultsDisplayProps {
  imageUrl: string | null;
  predictions: Prediction[] | null;
  isProcessing: boolean;
}

const ResultsDisplay: FC<ResultsDisplayProps> = ({
  imageUrl,
  predictions,
  isProcessing
}) => {
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.50);
  const [textSize, setTextSize] = useState(3);
  const [labelOpacity, setLabelOpacity] = useState(1);
  const [boundingBoxColor, setBoundingBoxColor] = useState('#ffff00');

  const availableColors = ['#ff0000', '#7f00ff', '#ff00ff', 'ffff00', '#7cfc00',];
  
  // Always define hooks at the top level, never conditionally
  const filteredPredictions = useMemo(() => {
    return (predictions?.filter(
      pred => pred.confidence >= confidenceThreshold
    ) || []);
  }, [predictions, confidenceThreshold]);
  
  // Count occurrences of each class
  const classCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredPredictions.forEach(pred => {
      if (!counts[pred.class]) {
        counts[pred.class] = 0;
      }
      counts[pred.class]++;
    });
    return counts;
  }, [filteredPredictions]);
  
  // Get total count
  const totalCount = useMemo(() => {
    return Object.values(classCounts).reduce((sum, count) => sum + count, 0);
  }, [classCounts]);

  // Early return outside of hooks
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="w-full mt-8 results-section">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Preview */}
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="aspect-square w-full relative">
              <img
                src={imageUrl}
                alt="Uploaded preview"
                className="w-full h-full object-contain"
              />
              
              {/* Overlay bounding boxes if we have them */}
              {filteredPredictions && filteredPredictions.length > 0 && !isProcessing && (
                <div className="absolute inset-0">
                  {filteredPredictions
                    .filter(pred => pred.bbox)
                    .map((pred, idx) => {
                      const bbox = pred.bbox!;
                      
                      // Only render valid bounding boxes
                      if (!Number.isFinite(bbox.x) || !Number.isFinite(bbox.y) || 
                          !Number.isFinite(bbox.width) || !Number.isFinite(bbox.height)) {
                        console.warn('Invalid bounding box values:', bbox);
                        return null;
                      }
                      
                      // Ensure bbox values are within 0-1 range
                      const x = Math.max(0, Math.min(1, bbox.x));
                      const y = Math.max(0, Math.min(1, bbox.y));
                      // Make bounding boxes smaller by reducing width and height
                      const width = Math.max(0, Math.min(1, bbox.width * 1)); // Reduce width by 0%
                      const height = Math.max(0, Math.min(1, bbox.height * 1)); // Reduce height by 0%
                      
                      // Recenter the box so it's still centered on the same point
                      const adjustedX = x + (bbox.width - width) / 2;
                      const adjustedY = y + (bbox.height - height) / 2;
                      
                      return (
                        <div
                          key={idx}
                          className="absolute"
                          style={{
                            left: `${adjustedX * 100}%`,
                            top: `${adjustedY * 100}%`,
                            width: `${width * 100}%`,
                            height: `${height * 100}%`,
                            borderWidth: '1px',
                            borderColor: boundingBoxColor,
                          }}
                        >
                          <span 
                            className="absolute top-0 left-0 px-0.5"
                            style={{
                              fontSize: `${textSize}px`,
                              opacity: labelOpacity,
                              backgroundColor: boundingBoxColor,
                              color: '#000',
                            }}
                          >
                            {pred.class} {Math.round(pred.confidence * 100)}%
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
            
            {/* Object Count Summary Box */}
            {filteredPredictions && filteredPredictions.length > 0 && !isProcessing && (
              <div className="bg-white border-t p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Layers size={16} style={{ color: '#ff0000' }} />
                  <h3 className="text-sm font-medium">Detection Summary</h3>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {Object.entries(classCounts).map(([className, count]) => (
                    <Badge key={className} variant="secondary" className="text-xs">
                      {className}: {count}
                    </Badge>
                  ))}
                </div>
                
                <div className="text-sm font-medium" style={{ color: '#ff0000' }}>
                  Total: {totalCount} {totalCount === 1 ? 'object' : 'objects'} detected
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Predictions List with Controls */}
        <Card>
          <CardContent className="p-4">
            {/* Controls Panel - Made smaller and more compact */}
            {predictions && predictions.length > 0 && !isProcessing && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                {/* Confidence Threshold Control */}
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <SlidersHorizontal size={14} className="text-gray-500" />
                    <h3 className="text-xs font-medium">Confidence: {Math.round(confidenceThreshold * 100)}%</h3>
                  </div>
                  <div className="px-1">
                    <Slider
                      value={[confidenceThreshold * 100]}
                      onValueChange={(values) => setConfidenceThreshold(values[0] / 100)}
                      min={0}
                      max={100}
                      step={1}
                      className="h-1.5" // Make slider smaller
                    />
                  </div>
                </div>
                
                {/* Text Size Control */}
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Text size={14} className="text-gray-500" />
                    <h3 className="text-xs font-medium">Label Size: {textSize}px</h3>
                  </div>
                  <div className="px-1">
                    <Slider
                      value={[textSize]}
                      onValueChange={(values) => setTextSize(values[0])}
                      min={0}
                      max={10}
                      step={1}
                      className="h-1.5" // Make slider smaller
                    />
                  </div>
                </div>
                
                {/* Label Opacity Control */}
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <EyeOff size={14} className="text-gray-500" />
                    <h3 className="text-xs font-medium">Label Opacity: {Math.round(labelOpacity * 100)}%</h3>
                  </div>
                  <div className="px-1">
                    <Slider
                      value={[labelOpacity * 100]}
                      onValueChange={(values) => setLabelOpacity(values[0] / 100)}
                      min={0}
                      max={100}
                      step={1}
                      className="h-1.5" // Make slider smaller
                    />
                  </div>
                </div>

                {/* Bounding Box Color Control */}
                <div className="mt-3">
                  <div className="flex items-center gap-1 mb-2">
                    <Text size={14} className="text-gray-500" />
                    <h3 className="text-xs font-medium">Box Color</h3>
                  </div>
                  <div className="flex gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setBoundingBoxColor(color)}
                        className={`w-4 h-4 rounded-full transition-transform ${
                          boundingBoxColor === color ? 'scale-110 ring-2 ring-gray-500' : ''
                        }`}
                        style={{
                          backgroundColor: color,
                        }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Detected Objects List - Now Scrollable */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <List size={16} style={{ color: '#ff0000' }} />
                <h3 className="text-lg font-medium">Detected Objects</h3>
              </div>
              
              {isProcessing ? (
              <div className="flex items-center justify-center h-40">
                <div
                   className="animate-spin rounded-full h-10 w-10 border-b-2"
                   style={{ borderColor: '#ff0000' }}
                ></div>
              </div>
              ) : filteredPredictions && filteredPredictions.length > 0 ? (
                <ScrollArea className="h-[320px] pr-4">
                  <div className="space-y-2">
                    {filteredPredictions.map((pred, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-gray-50 rounded-lg flex justify-between items-center"
                      >
                        <span className="font-medium text-gray-700">{pred.class}</span>
                        <span
                          className="text-xs font-medium px-2 py-1 rounded"
                          style={{
                            backgroundColor: '#030f37',
                            color: '#ffffff'
                          }}
                        >
                          {Math.round(pred.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-400">
                  {imageUrl ? 
                    (predictions && predictions.length > 0 ? 
                      "No objects above confidence threshold" : 
                      "No objects detected") : 
                    "Upload an image to see predictions"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsDisplay;
