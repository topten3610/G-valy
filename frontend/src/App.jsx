import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect } from "react";


import { fetchProducts } from "./store/productsSlice";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { fetchUserDetails } from "./store/userSlice";
import { fetchUserAddToCartCount, fetchUserCartData } from "./store/cartsSlice";
import {  fetchUserCartDataForOrder } from "./store/orderSlice";
import { FaSpinner } from "react-icons/fa";

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
        <Helmet>
          <title>EsalerBD - Your Trusted Online Store</title>
          <meta
            name="description"
            content="Shop at EsalerBD for top-quality products with fast delivery."
          />
          <meta
            name="keywords"
            content="EsalerBD, eCommerce, online store, fashion, electronics, Bangladesh"
          />

          {/* Open Graph Meta Tags */}
          <meta
            property="og:title"
            content="EsalerBD - Your Trusted Online Store"
          />
          <meta
            property="og:description"
            content="Explore top products on EsalerBD."
          />
          <meta
            property="og:image"
            content="https://www.esalerbd.com/src/assest/main_logo.jpeg"
          />
          <meta property="og:url" content="https://www.esalerbd.com" />
          <meta property="og:type" content="website" />

          {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="EsalerBD - Your Trusted Online Store"
          />
          <meta
            name="twitter:description"
            content="Shop the best products at EsalerBD."
          />
          <meta
            name="twitter:image"
            content="https://www.esalerbd.com/src/assest/main_logo.jpeg"
          />
        </Helmet>
        
    <div className="flex h-full w-full justify-center items-center min-h-screen bg-transparent">
      <div className="flex flex-col items-center space-y-4">
        <FaSpinner className="animate-spin text-blue-500 text-6xl" />
        <span className="text-gray-700 text-xl font-semibold">Loading...</span>
      </div>
    </div>

      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>EsalerBD - Your Trusted Online Store</title>
        <meta
          name="description"
          content="Shop at EsalerBD for top-quality products with fast delivery."
        />
        <meta
          name="keywords"
          content="EsalerBD, eCommerce, online store, fashion, electronics, Bangladesh"
        />

        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="EsalerBD - Your Trusted Online Store"
        />
        <meta
          property="og:description"
          content="Explore top products on EsalerBD."
        />
        <meta
          property="og:image"
          content="https://www.esalerbd.com/src/assest/main_logo.jpeg"
        />
        <meta property="og:url" content="https://www.esalerbd.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="EsalerBD - Your Trusted Online Store"
        />
        <meta
          name="twitter:description"
          content="Shop the best products at EsalerBD."
        />
        <meta
          name="twitter:image"
          content="https://www.esalerbd.com/src/assest/main_logo.jpeg"
        />
      </Helmet>
      <ScrollToTop />
      {/* <TopNavBar /> */}
      <Header />
      <main className="min-h-[calc(100vh-120px)]">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
