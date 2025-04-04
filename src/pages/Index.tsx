
import { useState } from 'react';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import ResultsDisplay from '@/components/ResultsDisplay';
import { analyzeImage, formatPredictions } from '@/services/roboflowService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Hardcoded API key and model ID
const API_KEY = 'KO8dKRKesUU1PwKj3TXs'; // Replace with your actual API key
const MODEL_ID = 'counting-pallets-b9xos'; // Replace with your actual model ID

// Model version precision data
const MODEL_PRECISION = {
  '1': '61.0%',
  '2': '91.9%',
  '3': '87.1%'
};

const Index = () => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Only keep the model version as configurable
  const [modelVersion, setModelVersion] = useState('2');
  
  const handleImageSelect = async (file: File, previewUrl: string) => {
    setSelectedImage(file);
    setImagePreview(previewUrl);
    setPredictions(null);
    
    try {
      setIsProcessing(true);
      const results = await analyzeImage(file, API_KEY, MODEL_ID, modelVersion);
      setPredictions(formatPredictions(results));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI-Based Pallet Detection Model
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Upload an image and the AI model will analyze it to detect and count objects in real-time. This AI model was made for internship project (Prabpol Veeraphan Burapha University International College)
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2"
            >
              Try it now
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex items-center gap-2"
              onClick={() => window.open('https://roboflow.com', '_blank')}
            >
              Learn more
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </section>
        
        {/* Upload Section */}
        <section id="upload-section" className="py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Your Image</h2>
            
            {/* Model Version Dropdown */}
            <div className="mb-6 border-b pb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Model Configuration</h3>
              
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                {/* Model Version Dropdown */}
                <div className="w-full md:w-48">
                  <label htmlFor="model-version" className="block text-sm font-medium text-gray-700 mb-2">
                    Model Version
                  </label>
                  <Select
                    value={modelVersion}
                    onValueChange={(value) => setModelVersion(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2 Recommended</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Model Precision Display */}
                <div className="flex flex-wrap gap-3 mb-2">
                  <div className={`rounded-md border px-3 py-2 ${modelVersion === '1' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="text-xs text-gray-500">Version 1</div>
                    <div className="font-medium text-sm flex items-center gap-1">
                      Precision: <Badge variant={modelVersion === '1' ? 'default' : 'secondary'} className={modelVersion === '1' ? 'bg-orange-500' : ''}>61.0%</Badge>
                    </div>
                  </div>
                  
                  <div className={`rounded-md border px-3 py-2 ${modelVersion === '2' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="text-xs text-gray-500">Version 2</div>
                    <div className="font-medium text-sm flex items-center gap-1">
                      Precision: <Badge variant={modelVersion === '2' ? 'default' : 'secondary'} className={modelVersion === '2' ? 'bg-green-500' : ''}>91.9%</Badge>
                    </div>
                  </div>
                  
                  <div className={`rounded-md border px-3 py-2 ${modelVersion === '3' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="text-xs text-gray-500">Version 3</div>
                    <div className="font-medium text-sm flex items-center gap-1">
                      Precision: <Badge variant={modelVersion === '3' ? 'default' : 'secondary'} className={modelVersion === '3' ? 'bg-blue-500' : ''}>87.1%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <ImageUpload onImageSelect={handleImageSelect} isProcessing={isProcessing} />
            
            {/* Results Section */}
            <ResultsDisplay 
              imageUrl={imagePreview}
              predictions={predictions}
              isProcessing={isProcessing}
            />
          </div>
        </section>
        
        {/* How It Works */}
        <section id="how-it-works" className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Upload</h3>
                <p className="text-gray-600">Upload your image using simple drag & drop interface</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Process</h3>
                <p className="text-gray-600">The AI model analyzes the image to detect and count objects</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Results</h3>
                <p className="text-gray-600">View the labeled objects and confidence scores in real-time</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* About */}
        <section id="about" className="py-12 md:py-16 bg-white rounded-xl shadow-sm my-12">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6 text-center">About This Project</h2>
            <p className="text-gray-700 mb-4">
              This application uses AI models create from Roboflow to analyze and identify CHEP pallets in images. 
              The model has been trained on a dataset to recognize pallets with high accuracy.
            </p>
            <p className="text-gray-700">
              You can select different model versions to see how they perform on your images. Each version may have
              different capabilities and accuracy levels depending on its training.
            </p>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">{new Date().getFullYear()} Internship, Prabpol Veeraphan SLSM 64110059</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
