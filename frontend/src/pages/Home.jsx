import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import VerticalCardProduct from "../components/VerticalCardProduct";

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />

      <HorizontalCardProduct category={"health"} heading={"Health"} />
      <HorizontalCardProduct
        category={"man"}
        heading={"Popular's man product"}
      />

      <VerticalCardProduct category={"woman"} heading={"Woman"} />
      <VerticalCardProduct category={"fashion"} heading={"Fashion"} />
      <VerticalCardProduct category={"beauties"} heading={"Beauties"} />
    </div>
  );
};

export default Home;
