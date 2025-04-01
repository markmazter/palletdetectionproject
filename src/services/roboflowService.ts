
interface PredictionResponse {
  predictions: {
    class: string;
    confidence: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }[];
  time: number;
}

export const analyzeImage = async (
  imageFile: File,
  apiKey: string,
  modelId: string = 'your-model-id',
  modelVersion: string = 'your-model-version'
): Promise<PredictionResponse> => {
  try {
    console.log('Analyzing image with Roboflow API...', imageFile.name);

    // Create form data to send to Roboflow
    const formData = new FormData();
    formData.append('file', imageFile);
    
    // Check if API key is provided
    if (!apiKey) {
      console.error('No API key provided');
      throw new Error('API key is required to analyze images');
    }
    
    // Make the actual API request to Roboflow
    const response = await fetch(
      `https://detect.roboflow.com/${modelId}/${modelVersion}?api_key=${apiKey}`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      throw new Error(`Failed to analyze image: ${response.statusText}`);
    }
    
    // Parse and return the response
    const data = await response.json();
    console.log('Roboflow API response:', data);
    return data;
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    throw error;
  }
};

export const formatPredictions = (response: PredictionResponse) => {
  return response.predictions.map(pred => ({
    class: pred.class,
    confidence: pred.confidence,
    bbox: pred.x !== undefined ? {
      x: pred.x - (pred.width || 0) / 2, // Convert from center to top-left
      y: pred.y - (pred.height || 0) / 2,
      width: pred.width || 0,
      height: pred.height || 0
    } : undefined
  }));
};
