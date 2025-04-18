
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import UploadSection from '@/components/UploadSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <UploadSection />
        <AboutSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
