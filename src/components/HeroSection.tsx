
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="py-12 md:py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        AI-Based Pallet Detection Model
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Upload an image and the AI model will analyze it to detect and count objects in real-time. 
        This AI model was made for internship project (Prabpol Veeraphan Burapha University International College)
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
        <Button 
          variant="outline" 
          size="lg" 
          className="flex items-center gap-2"
          onClick={() => window.open('https://www.cevalogistics.com/en', '_blank')}
        >
          CEVA Logistics
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
