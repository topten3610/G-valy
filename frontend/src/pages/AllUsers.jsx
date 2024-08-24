import { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import moment from "moment";
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from "../components/ChangeUserRole";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    _id: "",
  });

  const fetchAllUsers = async () => {
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();

    if (dataResponse.success) {
      setAllUsers(dataResponse.data);
    }

    if (dataResponse.error) {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="bg-white pb-4 px-4">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-black text-white text-xs sm:text-sm">
            <th className="py-2 px-1 sm:px-2">Sr.</th>
            <th className="py-2 px-1 sm:px-2">Name</th>
            <th className="py-2 px-1 sm:px-2">Email</th>
            <th className="py-2 px-1 sm:px-2">Role</th>
            <th className="py-2 px-1 sm:px-2">Created Date</th>
            <th className="py-2 px-1 sm:px-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {allUser.map((el, index) => (
            <tr key={index} className="text-xs sm:text-sm border-b">
              <td className="py-2 px-1 sm:px-2">{index + 1}</td>
              <td className="py-2 px-1 sm:px-2">{el?.name}</td>
              <td className="py-2 px-1 sm:px-2">{el?.email}</td>
              <td className="py-2 px-1 sm:px-2">{el?.role}</td>
              <td className="py-2 px-1 sm:px-2">
                {moment(el?.createdAt).format("LL")}
              </td>
              <td className="py-2 px-1 sm:px-2">
                <button
                  className="bg-green-100 p-1 sm:p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white"
                  onClick={() => {
                    setUpdateUserDetails(el);
                    setOpenUpdateRole(true);
                  }}
                >
                  <MdModeEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
