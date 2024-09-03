import { FaPhoneSquare, FaEnvelope, FaBars } from "react-icons/fa";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterSquare,
  AiFillGooglePlusSquare,
} from "react-icons/ai";

const TopNavBar = () => {
  return (
    <div className="bg-gray-800 text-white text-sm sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-2 px-4">
        {/* Left Side: Contact Information */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <a href="#" className="hover:text-gray-300">
            64, Dilkusha C/A, Motijheel, Dhaka.
          </a>
          <a
            href="tel:+1234567890"
            className="flex items-center hover:text-gray-300"
          >
            <FaPhoneSquare className="mr-2" /> (+88) 0969709903
          </a>
          <a
            href="mailto:support@support.com"
            className="flex items-center hover:text-gray-300"
          >
            <FaEnvelope className="mr-2" /> support@ajkerfashion.com.bd
          </a>
        </div>

        {/* Right Side: Social Links and Menu */}
        <div className="flex items-center space-x-6 mt-2 md:mt-0">
          {/* Social Links */}
          <div className="flex space-x-3">
            <a
              href="https://www.facebook.com/ajkerfashionltd"
              className="hover:text-gray-300"
            >
              <AiFillFacebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/ajkerfashionltd"
              className="hover:text-gray-300"
            >
              <AiFillInstagram size={20} />
            </a>
            <a
              href="https://twitter.com/ajkefashionltd"
              className="hover:text-gray-300"
            >
              <AiFillTwitterSquare size={20} />
            </a>
            <a href="https://g.co/kgs/CmLWCVY" className="hover:text-gray-300">
              <AiFillGooglePlusSquare size={20} />
            </a>
          </div>

          {/* Top Bar Menu */}
          <nav className="relative">
            <button className="flex items-center hover:text-gray-300 focus:outline-none">
              <FaBars size={20} />
              <span className="ml-2">Menu</span>
            </button>
            <ul className="absolute right-0 mt-2 bg-gray-800 text-white rounded-md shadow-lg py-1 hidden group-hover:block">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-700">
                  Login
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
