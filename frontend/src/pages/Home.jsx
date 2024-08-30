import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import VerticalCardProduct from "../components/VerticalCardProduct";

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />

      <HorizontalCardProduct category={"Health"} heading={"Health"} />
      <HorizontalCardProduct
        category={"Man"}
        heading={"Popular's man product"}
      />

      <VerticalCardProduct category={"woman"} heading={"woman"} />
      <VerticalCardProduct category={"Fashion"} heading={"Fashion"} />
      <VerticalCardProduct category={"Beauties"} heading={"Beauties"} />
    </div>
  );
};

export default Home;
