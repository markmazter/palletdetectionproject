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
  image?: {
    width: number;
    height: number;
  };
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
  // Extract image dimensions from response if available
  const imageWidth = response.image?.width || 0;
  const imageHeight = response.image?.height || 0;
  
  return response.predictions.map(pred => {
    // Check if bounding box coordinates are available
    if (pred.x === undefined || pred.y === undefined || !pred.width || !pred.height) {
      return {
        class: pred.class,
        confidence: pred.confidence,
        bbox: undefined
      };
    }
    
    // Calculate normalized coordinates (0-1 range)
    // If image dimensions are available in the response, use them for normalization
    // Otherwise, assume coordinates are already normalized
    let x = pred.x;
    let y = pred.y;
    let width = pred.width;
    let height = pred.height;
    
    if (imageWidth > 0 && imageHeight > 0) {
      // Convert absolute coordinates to normalized (0-1)
      x = x / imageWidth;
      y = y / imageHeight;
      width = width / imageWidth;
      height = height / imageHeight;
    }

    // Roboflow returns center coordinates, convert to top-left for display
    return {
      class: pred.class,
      confidence: pred.confidence,
      bbox: {
        x: x - (width / 2), // Convert from center to top-left
        y: y - (height / 2),
        width: width,
        height: height
      }
    };
  });
};
