
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
  apiKey: string = ''
): Promise<PredictionResponse> => {
  // For demonstration purposes, the function returns mock data
  // Replace this with actual API integration when you have your Roboflow API key
  
  console.log('Analyzing image...', imageFile.name);
  
  // Mock delay to simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock response - replace with actual API call to Roboflow
  // Example of how you might implement the actual API call:
  /*
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await fetch(
    `https://detect.roboflow.com/your-model-id/your-model-version?api_key=${apiKey}`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to analyze image');
  }
  
  return await response.json();
  */

  // Mock data for demonstration
  return {
    predictions: [
      {
        class: "Person",
        confidence: 0.92,
        x: 0.2,
        y: 0.3,
        width: 0.4,
        height: 0.5
      },
      {
        class: "Car",
        confidence: 0.87,
        x: 0.7,
        y: 0.6,
        width: 0.25,
        height: 0.2
      },
      {
        class: "Dog",
        confidence: 0.76,
        x: 0.1,
        y: 0.8,
        width: 0.15,
        height: 0.15
      }
    ],
    time: 0.6542
  };
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
