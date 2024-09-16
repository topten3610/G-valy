import { useEffect, useState } from "react";
import SummaryApi from "../../common";
import { toast } from "react-toastify";
import moment from "moment";
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from "../../components/ChangeUserRole";
import { FaSpinner } from "react-icons/fa6";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [loading,setLoading] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    _id: "",
  });

  const fetchAllUsers = async () => {
   setLoading(true); 
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();

    if (dataResponse.success) {
      setAllUsers(dataResponse.data);
    }

    setLoading(false);

    if (dataResponse.error) {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          <p className="text-center text-lg font-semibold text-gray-700">
            Loading...
          </p>
        </div>
      </div>
    );
  
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            All Users
          </h1>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-800 text-white text-xs sm:text-sm">
                  <th className="py-2 px-4 text-left">Sr.</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Created Date</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {allUser.map((el, index) => (
                  <tr key={el._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{el?.name}</td>
                    <td className="py-3 px-4">{el?.email}</td>
                    <td className="py-3 px-4">{el?.role}</td>
                    <td className="py-3 px-4">
                      {moment(el?.createdAt).format("LL")}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-green-500 text-white p-2 rounded-full transition-transform transform hover:scale-105 focus:outline-none"
                        onClick={() => {
                          setUpdateUserDetails(el);
                          setOpenUpdateRole(true);
                        }}
                      >
                        <MdModeEdit size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
