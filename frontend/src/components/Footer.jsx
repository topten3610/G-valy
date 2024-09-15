
import { Link } from "react-router-dom";
import mainLogo from "../assest/main_logo.png";
const Footer = () => {
  return (
    <div className="p-6 bg-slate-900 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col">
          <div>
            <p className="text-sm text-gray-400">
              Exclusive Deals & Discounts: At EsalerBd, we believe in offering
              our customers the best value for their money. Enjoy amazing
              discounts, seasonal sales, and exclusive deals that you won’t find
              anywhere else.
            </p>
          </div>
          {/* <img src={ mainLogo} alt="main logo" className="h-52" /> */}
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-xl font-bold mb-4">Your Details</h1>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-blue-500">
              <Link to="/">Profile</Link>
            </li>
            <li className="hover:text-blue-500">
              <Link to="/">Orders</Link>
            </li>
            <li className="hover:text-blue-500">
              <Link to="/">Account Details</Link>
            </li>
            <li className="hover:text-blue-500">
              <Link to="/">Payment Options</Link>
            </li>
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-xl font-bold mb-4"></h1>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-blue-500">
              <Link to="/about-us">About Us</Link>
            </li>
            <li className="hover:text-blue-500">
              <Link to="/contact-us">Contract Us</Link>
            </li>
            <li className="hover:text-blue-500">
              <Link to="/">Privacy Policy</Link>
            </li>
            <li className="hover:text-blue-500">
              <Link to="/">Terms & Conditions</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
