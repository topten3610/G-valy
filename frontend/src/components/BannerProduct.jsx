import { useEffect, useState } from "react";
import banner from "../assest/banner/banner1.jpeg";
import image2 from "../assest/banner/img2.webp";
import image3 from "../assest/banner/img3.jpg";
import image4 from "../assest/banner/img4.jpg";
import image5 from "../assest/banner/img5.webp";

import image1Mobile from "../assest/banner/img1_mobile.jpg";
import image2Mobile from "../assest/banner/img2_mobile.webp";
import image3Mobile from "../assest/banner/img3_mobile.jpg";
import image4Mobile from "../assest/banner/img4_mobile.jpg";
import image5Mobile from "../assest/banner/img5_mobile.png";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const desktopImages = [banner, image2, image3, image4, image5];
  const mobileImages = [
    image1Mobile,
    image2Mobile,
    image3Mobile,
    image4Mobile,
    image5Mobile,
  ];

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
      <div className="hidden md:block relative w-full h-[400px] lg:h-[520px] xl:h-[520px]">
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
                className="w-full h-full object-fill  rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden relative w-full h-[250px] sm:h-[300px]">
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button
            onClick={prevImage}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-110"
            aria-label="Previous Image"
          >
            <FaAngleLeft className="text-xl text-gray-800" />
          </button>
          <button
            onClick={nextImage}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-110"
            aria-label="Next Image"
          >
            <FaAngleRight className="text-xl text-gray-800" />
          </button>
        </div>
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {mobileImages.map((image, index) => (
            <div className="w-full h-full flex-shrink-0" key={index}>
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
