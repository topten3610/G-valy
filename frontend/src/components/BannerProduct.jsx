import { useEffect, useState } from "react";
import banner1 from "../assest/banner/banner1.jpeg";
import banner2 from "../assest/banner/banner2.jpeg";


import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const desktopImages = [banner1, banner2, banner1];
  const mobileImages = [banner1, banner2, banner1];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % desktopImages.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + desktopImages.length) % desktopImages.length
    );
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <div className="md:container md:m-auto relative overflow-hidden rounded-lg">
      {/* Desktop and Tablet Version */}
      <div className="hidden md:block relative w-full ">
        <div className="absolute inset-0 flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={prevImage}
            className="z-10 p-2 lg:p-4 rounded-full shadow-xl bg-white hover:bg-gray-200 transition-transform transform hover:scale-110"
            aria-label="Previous Image"
          >
            <FaAngleLeft className="text-xl lg:text-3xl text-gray-800" />
          </button>
          <button
            onClick={nextImage}
            className="z-10 p-2 lg:p-4 rounded-full shadow-xl bg-white hover:bg-gray-200 transition-transform transform hover:scale-110"
            aria-label="Next Image"
          >
            <FaAngleRight className="text-xl lg:text-3xl text-gray-800" />
          </button>
        </div>
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {desktopImages.map((image, index) => (
            <div className="w-full h-full flex-shrink-0" key={index}>
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-full object-contain  rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden relative w-full h-auto sm:h-[300px]">
        <div className="absolute inset-0 flex items-center justify-between px-4"></div>
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {mobileImages.map((image, index) => (
            <div className="w-full h-full flex-shrink-0" key={index}>
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
