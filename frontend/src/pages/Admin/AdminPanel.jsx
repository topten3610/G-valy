import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {  FaBars, FaTimes } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../../common/role";
import registerServiceWorker from "../../helpers/sendNotification";

const AdminPanel = () => {
  const { user, loading, error } = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkUserRole = () => {
      if (user?.role === ROLE.ADMIN) {
        registerServiceWorker();
      } else {
        navigate("/");
      }
    };

    if (user?.role === ROLE.ADMIN || user === undefined) {
      checkUserRole();
    }
  }, [user?.role, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="bg-white w-full md:w-64 shadow-lg md:shadow-none md:rounded-lg md:min-h-screen relative">
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="relative flex justify-center items-center w-20 h-20 rounded-full overflow-hidden bg-gray-200">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-full h-full object-cover"
                alt={user?.name}
              />
            ) : (
              <FaRegCircleUser className="text-gray-600 text-4xl" />
            )}
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-600">{user?.role}</p>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute top-4 right-4 md:hidden text-gray-600"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Dropdown Menu */}
        <nav
          className={`md:flex md:flex-col p-4 space-y-2 md:space-y-0 md:p-0 md:space-x-4 transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "block" : "hidden"
          } md:block`}
        >
          <p></p>
          <Link
            to={"all-users"}
            className="block px-4 py-2 rounded-md hover:bg-gray-100 transition duration-200"
          >
            All Users
          </Link>
          <Link
            to={"all-products"}
            className="block px-4 py-2 rounded-md hover:bg-gray-100 transition duration-200"
          >
            All Products
          </Link>
          <Link
            to={"all-orders"}
            className="block px-4 py-2 rounded-md hover:bg-gray-100 transition duration-200"
          >
            All Orders
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
