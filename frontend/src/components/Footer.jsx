const Footer = () => {
  return (
    <footer className="bg-[#091020] text-white py-8 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold mb-2">
            Dynamic Coding with Rimon Hossain
          </p>
          <div className="flex gap-4 mb-4">
            <a
              href="https://www.youtube.com/channel/UC1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300"
              title="YouTube Channel"
            >
              <i className="fab fa-youtube text-2xl"></i>
            </a>
            {/* Add more social media icons here */}
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Dynamic Coding with Rimon Hossain.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
