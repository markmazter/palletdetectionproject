
import { supabase } from "@/integrations/supabase/client";

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
  apiKey?: string, // No longer used directly
  modelId?: string, // No longer used directly
  modelVersion: string = '2'
): Promise<PredictionResponse> => {
  try {
    console.log('Analyzing image through Supabase Edge Function...', imageFile.name);
    
    // Convert image to base64 string instead of using FormData
    const reader = new FileReader();
    const imageBase64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
    
    reader.readAsDataURL(imageFile);
    const imageBase64 = await imageBase64Promise;
    
    // Call our secure Edge Function with JSON data instead of FormData
    const { data, error } = await supabase.functions.invoke(`analyze-image?modelVersion=${modelVersion}`, {
      body: JSON.stringify({ 
        imageBase64,
        filename: imageFile.name
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    
    if (error) {
      console.error('Edge Function error:', error);
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
    
    console.log('Edge Function response:', data);
    
    // Ensure we use a standardized image size in the response
    if (!data.image) {
      data.image = {
        width: 1280,
        height: 1280
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    throw error;
  }
};

export const formatPredictions = (response: PredictionResponse) => {
  // Use 640x640 as our standard size if no image dimensions are provided
  const imageWidth = response.image?.width || 1280;
  const imageHeight = response.image?.height || 1280;
  
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
