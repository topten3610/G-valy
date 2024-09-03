
import { Link } from "react-router-dom";

const Footer = () => {


  return (
    <div className="p-6 bg-gray-900 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col">
          <div className="my-4">
            <h1 className="text-4xl font-bold text-blue-500">Logo</h1>
          </div>
          <div>
            <p className="text-sm text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perferendis placeat pariatur officiis, labore asperiores vel
              voluptatum, nihil quasi quos saepe.
            </p>
          </div>
          <div className="mt-6 flex space-x-4">
            <a
              href="https://github.com/likhon122"
              className="bg-blue-500 p-2 rounded-full border border-blue-500 text-white hover:bg-transparent hover:text-blue-500 transition-all duration-300"
              title="Github"
            >
              <i className="fa-brands fa-github"></i>
            </a>
            <a
              href=""
              className="bg-blue-500 p-2 rounded-full border border-blue-500 text-white hover:bg-transparent hover:text-blue-500 transition-all duration-300"
              title="LinkedIn"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a
              href="https://www.instagram.com/imd.likhon/"
              className="bg-blue-500 p-2 rounded-full border border-blue-500 text-white hover:bg-transparent hover:text-blue-500 transition-all duration-300"
              title="Instagram"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href="https://web.facebook.com/mdlikhon.islam.3975012"
              className="bg-blue-500 p-2 rounded-full border border-blue-500 text-white hover:bg-transparent hover:text-blue-500 transition-all duration-300"
              title="Facebook"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold mb-4">Shop</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Electronics</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-blue-500">
                  <Link to="/">Mobile</Link>
                </li>
                <li className="hover:text-blue-500">
                  <Link to="/">TV</Link>
                </li>
                <li className="hover:text-blue-500">
                  <Link to="/">Camera</Link>
                </li>
                <li className="hover:text-blue-500">
                  <Link to="/#">Drone</Link>
                </li>
                <li className="hover:text-blue-500">
                  <Link to="/">Smart Watch</Link>
                </li>
                <li className="hover:text-blue-500">
                  <Link to="/">Earphone</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Accessories</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-blue-500">
                  <Link to="/">Headphones</Link>
                </li>
                <li className="hover:text-blue-500">
                  <Link to="/">Chargers</Link>
                </li>
                <li className="hover:text-blue-500">
                  <Link to="/">Cases</Link>
                </li>
                <li className="hover:text-blue-500">
                  <Link to="/">Batteries</Link>
                </li>
                <li className="hover:text-blue-500">
                  <Link to="/">Cables</Link>
                </li>
                <li className="hover:text-blue-500">
                  <Link to="/">Screen Protectors</Link>
                </li>
              </ul>
            </div>
          </div>
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
      </div>
    </div>
  );
};

export default Footer;
