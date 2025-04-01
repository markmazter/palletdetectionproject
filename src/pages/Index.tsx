
import { useState } from 'react';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import ResultsDisplay from '@/components/ResultsDisplay';
import { analyzeImage, formatPredictions } from '@/services/roboflowService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Index = () => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  const handleImageSelect = async (file: File, previewUrl: string) => {
    setSelectedImage(file);
    setImagePreview(previewUrl);
    setPredictions(null);
    
    // Validate API key is present
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Roboflow API key before analyzing images.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      const results = await analyzeImage(file, apiKey.trim());
      setPredictions(formatPredictions(results));
      toast({
        title: "Analysis complete!",
        description: `Detected ${results.predictions.length} objects in the image.`
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error processing your image. Please check your API key and try again.",
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
            AI Vision Model
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Upload an image and our AI will analyze it to detect and classify objects in real-time.
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
            
            {/* API Key Input */}
            <div className="mb-6 border-b pb-6">
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
                Roboflow API Key
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your Roboflow API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="pl-10"
                  />
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://docs.roboflow.com/api-reference/authentication', '_blank')}
                >
                  Get API Key
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Your API key is required to access the Roboflow model. It will not be stored on our servers.
              </p>
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
                <p className="text-gray-600">Upload your image using our simple drag & drop interface</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Process</h3>
                <p className="text-gray-600">Our AI model analyzes your image to detect and classify objects</p>
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
              This application uses computer vision AI models from Roboflow to analyze and identify objects in images. 
              The model has been trained on a diverse dataset to recognize common objects with high accuracy.
            </p>
            <p className="text-gray-700">
              To use your own Roboflow model, you'll need to connect your API key and update the model endpoint in the 
              application settings. The current implementation uses a demonstration model for testing purposes.
            </p>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">© {new Date().getFullYear()} AI Vision Model</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
