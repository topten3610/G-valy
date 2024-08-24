import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import SummaryApi from "./common";
import Context from "./context";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import { fetchProducts } from "./store/productsSlice";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  console.log(user);
  const [cartProductCount, setCartProductCount] = useState(0);

  const fetchUserDetails = async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data));
    }
  };


  

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const fetchUserAddToCart = async () => {
    if (user && user._id) {
      try {
        const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
          method: SummaryApi.addToCartProductCount.method,
          credentials: "include",
        });

        const dataApi = await dataResponse.json();
        setCartProductCount(dataApi?.data?.count || 0);
      } catch (error) {
        console.error("Error fetching cart product count:", error);
      }
    } else {
      // For unauthorized users: Get cart count from local storage
      const localCart = JSON.parse(localStorage.getItem("cart"));
      const cartProductCount = localCart
        ? localCart?.items?.reduce((acc, item) => acc + item.quantity, 0)
        : 0;
      setCartProductCount(cartProductCount);
    }
  };

  useEffect(() => {
    /** Fetch user details */
    fetchUserDetails();
    /** Fetch cart product count */
    fetchUserAddToCart();
  }, [user]);

  return (
    <>
      <Context.Provider
        value={{
          fetchUserDetails, // user detail fetch
          cartProductCount, // current user add to cart product count
          fetchUserAddToCart,
        }}
      >
        <ToastContainer position="top-center" />
        <Header />
        <ScrollToTop />
        <main className="min-h-[calc(100vh-120px)] pt-16">
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;
