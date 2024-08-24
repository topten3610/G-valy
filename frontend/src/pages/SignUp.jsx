import { useState } from "react";
import loginIcons from "../assest/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import imageTobase64 from "../helpers/imageTobase64";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    const imagePic = await imageTobase64(file);
    setData((prev) => ({
      ...prev,
      profilePic: imagePic,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password === data.confirmPassword) {
      const response = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const dataApi = await response.json();
      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/login");
      } else {
        toast.error(dataApi.message);
      }
    } else {
      toast.error("Passwords do not match.");
    }
  };

  return (
    <section
      id="signup"
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 relative overflow-hidden rounded-full border-2 border-gray-300 bg-gray-200">
            <img
              src={data.profilePic || loginIcons}
              alt="Profile"
              className="object-cover w-full h-full"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700 text-white cursor-pointer">
              <span className="text-sm">Upload Photo</span>
              <input
                type="file"
                className="hidden"
                onChange={handleUploadPic}
              />
            </label>
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold mb-1">Name:</label>
            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email:</label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={data.password}
                name="password"
                onChange={handleOnChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={data.confirmPassword}
                name="confirmPassword"
                onChange={handleOnChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#FF5722] text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#FF5722] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
