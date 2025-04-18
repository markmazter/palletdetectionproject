
const AboutSection = () => {
  return (
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
  );
};

export default AboutSection;
