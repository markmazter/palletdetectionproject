
import { FC, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal } from 'lucide-react';

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
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.25); // Default threshold at 25%

  if (!imageUrl) {
    return null;
  }

  // Filter predictions based on confidence threshold
  const filteredPredictions = predictions?.filter(
    pred => pred.confidence >= confidenceThreshold
  ) || [];

  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
      
      {/* Confidence Threshold Slider */}
      {predictions && predictions.length > 0 && !isProcessing && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal size={16} className="text-gray-500" />
            <h3 className="text-sm font-medium">Confidence Threshold: {Math.round(confidenceThreshold * 100)}%</h3>
          </div>
          <div className="px-2">
            <Slider
              value={[confidenceThreshold * 100]}
              onValueChange={(values) => setConfidenceThreshold(values[0] / 100)}
              min={0}
              max={100}
              step={1}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Showing {filteredPredictions.length} of {predictions.length} detections
          </p>
        </div>
      )}
      
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
                      const width = Math.max(0, Math.min(1, bbox.width * 0.8)); // Reduce width by 20%
                      const height = Math.max(0, Math.min(1, bbox.height * 0.8)); // Reduce height by 20%
                      
                      // Recenter the box so it's still centered on the same point
                      const adjustedX = x + (bbox.width - width) / 2;
                      const adjustedY = y + (bbox.height - height) / 2;
                      
                      return (
                        <div
                          key={idx}
                          className="absolute border-2 border-blue-500"
                          style={{
                            left: `${adjustedX * 100}%`,
                            top: `${adjustedY * 100}%`,
                            width: `${width * 100}%`,
                            height: `${height * 100}%`,
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          }}
                        >
                          <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-sm">
                            {pred.class} {Math.round(pred.confidence * 100)}%
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Predictions List */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Detected Objects</h3>
            
            {isProcessing ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredPredictions && filteredPredictions.length > 0 ? (
              <div className="space-y-3">
                {filteredPredictions.map((pred, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-700">{pred.class}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {Math.round(pred.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-400">
                {imageUrl ? 
                  (predictions && predictions.length > 0 ? 
                    "No objects above confidence threshold" : 
                    "No objects detected") : 
                  "Upload an image to see predictions"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsDisplay;
