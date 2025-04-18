
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">{new Date().getFullYear()} Internship, Prabpol Veeraphan SLSM 64110059</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
