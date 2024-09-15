import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./store/productsSlice";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { fetchUserDetails } from "./store/userSlice";
import { fetchUserAddToCartCount, fetchUserCartData } from "./store/cartsSlice";
import {  fetchUserCartDataForOrder } from "./store/orderSlice";

// import TopNavBar from "./components/TopNavBar/TopNavBar";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  
  useEffect(() => {
    /** Fetch user details */
    const fetchData = async () => {
      await dispatch(fetchUserDetails()).unwrap();
      await dispatch(fetchProducts()).unwrap();
      dispatch(fetchUserCartData());
      dispatch(fetchUserAddToCartCount());
      dispatch(fetchUserCartDataForOrder());
    };
    fetchData();
  }, [dispatch, user?._id]);



  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <ToastContainer position="top-center" />
      {/* <TopNavBar /> */}
      <Header />
      <main className="min-h-[calc(100vh-120px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
