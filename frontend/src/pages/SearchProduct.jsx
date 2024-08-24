import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SummaryApi from "../common";
import VerticalCard from "../components/VerticalCard";

const SearchProduct = () => {
  const query = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("query", query.search);

  const fetchProduct = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.searchProduct.url + query.search);
    const dataResponse = await response.json();
    setLoading(false);

    setData(dataResponse.data);
  };

  useEffect(() => {
    fetchProduct();
  }, [query.search]);

  return (
    <div className="container mx-auto p-4">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="loader"></div>
        </div>
      )}

      <div className="mb-6 text-center">
        <p className="text-2xl font-bold mb-2">Search Results</p>
        <p className="text-lg font-medium text-gray-600">
          {data.length} {data.length === 1 ? "result" : "results"} found
        </p>
      </div>

      {data.length === 0 && !loading && (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <div className="text-4xl text-gray-400 mb-4">📭</div>
          <h2 className="text-xl font-semibold mb-2">No Data Found</h2>
          <p className="text-gray-600 mb-4">
            It seems like we couldn't find any products matching your search.
          </p>
          <a href="/" className="text-blue-500 hover:underline text-lg">
            Go back to the homepage
          </a>
        </div>
      )}

      {data.length > 0 && !loading && <VerticalCard data={data} />}
    </div>
  );
};

export default SearchProduct;
