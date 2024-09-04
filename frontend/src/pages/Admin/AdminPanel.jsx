import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../../common/role";
import registerServiceWorker from "../../helpers/sendNotification";


const AdminPanel = () => {
  const { user, loading, error } = useSelector((state) => state?.user);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = () => {
      if (user?.role === ROLE.ADMIN) {
        registerServiceWorker();
      } else {
        navigate("/");
      }
    };
    console.log(user);
    // Run checkUserRole when user is not null and not loading
    if (user?.role === ROLE.ADMIN || user === undefined) {
      checkUserRole();
    }
  }, [user?.role, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col md:flex-row">
     
      <aside className="bg-white min-h-full w-full md:max-w-60 customShadow">
        <div className="h-32 flex justify-center items-center flex-col">
          <div className="text-5xl cursor-pointer relative flex justify-center">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-20 h-20 rounded-full"
                alt={user?.name}
              />
            ) : (
              <FaRegCircleUser />
            )}
          </div>
          <p className="capitalize text-lg font-semibold">{user?.name}</p>
          <p className="text-sm">{user?.role}</p>
        </div>

        {/***navigation */}
        <div>
          <nav className="grid p-4">
            <Link
              to={"all-users"}
              className="px-2 py-1 hover:bg-slate-100 rounded"
            >
              All Users
            </Link>
            <Link
              to={"all-products"}
              className="px-2 py-1 hover:bg-slate-100 rounded"
            >
              All Products
            </Link>
            <Link
              to={"all-orders"}
              className="px-2 py-1 hover:bg-slate-100 rounded"
            >
              All Orders
            </Link>
          </nav>
        </div>
      </aside>

      <main className="w-full h-full p-2 md:ml-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
