
import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';

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
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="w-full mt-8">
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
              {predictions && predictions.length > 0 && !isProcessing && (
                <div className="absolute inset-0">
                  {predictions
                    .filter(pred => pred.bbox)
                    .map((pred, idx) => {
                      const bbox = pred.bbox!;
                      return (
                        <div
                          key={idx}
                          className="absolute border-2 border-blue-500"
                          style={{
                            left: `${bbox.x * 100}%`,
                            top: `${bbox.y * 100}%`,
                            width: `${bbox.width * 100}%`,
                            height: `${bbox.height * 100}%`,
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
            ) : predictions && predictions.length > 0 ? (
              <div className="space-y-3">
                {predictions.map((pred, idx) => (
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
                {imageUrl ? "No objects detected" : "Upload an image to see predictions"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsDisplay;
