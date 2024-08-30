import {  useEffect, useRef, useState } from "react";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";

import ConfirmLogoutModal from "./ConfirmLogoutModal";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const { cartsData, cartsCount } = useSelector((state) => state.carts);

  const [menuDisplay, setMenuDisplay] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);

  // Refs for user icon and menu
  const userIconRef = useRef(null);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }

    setLogoutModalOpen(false); // Close the modal after logout
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (cartsCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartsCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userIconRef.current &&
        !userIconRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuDisplay(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div className="flex items-center">
          <Link to={"/"}>
            <h1 className="text-lg font-bold">RmEcommerce</h1>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center w-full justify-between max-w-lg border rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-2 px-4 rounded-full outline-none border-none focus:ring-2 focus:ring-[#FF5722] transition-all duration-300"
            onChange={handleSearch}
            value={search}
          />
          <button className="bg-[#FF5722] flex items-center justify-center rounded-full p-2 ml-2 transition-transform duration-300 hover:scale-105 active:scale-95">
            <GrSearch className="text-white text-xl" />
          </button>
        </div>

        {/* Mobile Search Bar Toggle */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <GrSearch />
        </button>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white p-2 shadow-md z-50">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border p-2 rounded"
              onChange={handleSearch}
              value={search}
            />
          </div>
        )}

        <div className="flex items-center gap-7">
          <Link to={"/cart"} className="text-2xl text-[#FF5722] relative">
            <FaShoppingCart />
            {cartsCount >= 0 && (
              <div
                className={`bg-[#FF5722] text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3 ${
                  animate ? "badge-animate" : ""
                }`}
              >
                <p className="text-sm">{cartsCount}</p>
              </div>
            )}
          </Link>

          {user?._id ? (
            <div className="relative" ref={userIconRef}>
              <div
                className="text-3xl cursor-pointer flex justify-center items-center"
                onClick={() => setMenuDisplay((prev) => !prev)}
              >
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    className="w-10 h-10 rounded-full"
                    alt={user?.name}
                  />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>

              {menuDisplay && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50"
                  ref={menuRef}
                >
                  <nav className="flex flex-col text-sm">
                    {/* User Information */}
                    <div className="flex flex-col items-center px-4 py-3 border-b border-gray-200">
                      <div
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => {
                          navigate(`/profile`);
                          setMenuDisplay((prev) => !prev);
                        }}
                      >
                        <div className="relative w-16 h-16">
                          {user?.profilePic ? (
                            <img
                              src={user?.profilePic}
                              className="w-full h-full rounded-full object-cover"
                              alt={user?.name}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full text-gray-600">
                              <FaRegCircleUser className="text-4xl" />
                            </div>
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-lg font-semibold text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {user?.role === ROLE.ADMIN && (
                      <Link
                        to={"/admin-panel/all-products"}
                        className="whitespace-nowrap block hover:bg-gray-100 px-4 py-2"
                        onClick={() => setMenuDisplay(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setLogoutModalOpen(true);
                        setMenuDisplay((prev) => !prev);
                      }}
                      className="whitespace-nowrap block text-left hover:bg-gray-100 px-4 py-2"
                    >
                      Logout
                    </button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={"/login"}
              className="px-3 py-1 rounded-full text-white bg-[#FF5722] hover:bg-red-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmLogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
};

export default Header;
