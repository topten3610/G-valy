import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import VerticalCardProduct from "../components/VerticalCardProduct";
import { useSelector } from "react-redux";

const Home = () => {
  const { products, loading, error } = useSelector((state) => state.products);
  console.log(products)
  return (
    <div>
      <CategoryList />
      <BannerProduct />

      <HorizontalCardProduct category={"Health"} heading={"Health"} />
      <HorizontalCardProduct
        category={"Man"}
        heading={"Popular's man product"}
      />

      <VerticalCardProduct category={"mobiles"} heading={"Mobiles"} />
      <VerticalCardProduct category={"Mouse"} heading={"Mouse"} />
      <VerticalCardProduct category={"televisions"} heading={"Televisions"} />
      
    </div>
  );
};

export default Home;
