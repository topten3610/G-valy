import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect } from "react";


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
        <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
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
