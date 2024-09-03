import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import VerticalCard from "../components/VerticalCard";
import SummaryApi from "../common";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  const urlSearch = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const urlCategories = useMemo(() => {
    const categories = {};
    urlSearch.getAll("category").forEach((category) => {
      categories[category] = true;
    });
    return categories;
  }, [urlSearch]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: Object.keys(selectedCategories) }),
      });

      const result = await response.json();
      setData(result?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategories]);

  useEffect(() => {
    setSelectedCategories(urlCategories);
  }, [urlCategories]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchData();

    const categoryQuery = Object.keys(selectedCategories)
      .filter((key) => selectedCategories[key])
      .map((category) => `category=${category}`)
      .join("&");

    console.log(categoryQuery);
    
    navigate(`/product-category?${categoryQuery}`);
  }, [selectedCategories, navigate, fetchData]);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  const handleSortChange = (e) => {
    const { value } = e.target;
    setSortBy(value);
    setData((prev) =>
      [...prev].sort((a, b) =>
        value === "asc"
          ? a.sellingPrice - b.sellingPrice
          : b.sellingPrice - a.sellingPrice
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Mobile version - Filters */}
      <div className="lg:hidden">
        <div className="bg-white p-4 mb-4">
          <div className="mb-4">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full text-left flex items-center justify-between border-b pb-2 text-base font-medium text-slate-500"
            >
              Sort by {isSortOpen ? <MdExpandLess /> : <MdExpandMore />}
            </button>
            {isSortOpen && (
              <form className="text-sm flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="sortBy"
                    id="lowToHigh"
                    value="asc"
                    checked={sortBy === "asc"}
                    onChange={handleSortChange}
                    className="cursor-pointer"
                  />
                  <label htmlFor="lowToHigh" className="cursor-pointer">
                    Price - Low to High
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="sortBy"
                    id="highToLow"
                    value="dsc"
                    checked={sortBy === "dsc"}
                    onChange={handleSortChange}
                    className="cursor-pointer"
                  />
                  <label htmlFor="highToLow" className="cursor-pointer">
                    Price - High to Low
                  </label>
                </div>
              </form>
            )}
          </div>
          <div>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full text-left flex items-center justify-between border-b pb-2 text-base font-medium text-slate-500"
            >
              Category {isCategoryOpen ? <MdExpandLess /> : <MdExpandMore />}
            </button>
            {isCategoryOpen && (
              <div className="text-sm flex flex-col gap-2 pt-2">
                {productCategory.map((category) => (
                  <div className="flex items-center gap-3" key={category.value}>
                    <input
                      type="checkbox"
                      name="category"
                      value={category.value}
                      checked={!!selectedCategories[category.value]}
                      id={category.value}
                      onChange={handleCategoryChange}
                    />
                    <label htmlFor={category.value}>{category.label}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile version - Product grid */}
        {loading ? (
          <div className="flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
          </div>
        ) : (
          <>
            <p className="font-medium text-slate-800 text-lg my-2">
              Search Results: {data.length}
            </p>
            <VerticalCard data={data} />
          </>
        )}
      </div>

      {/* Desktop version */}
      <div className="hidden lg:grid grid-cols-[200px,1fr] gap-4">
        {/* Left side */}
        <div className="bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll">
          <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1">
            Sort by
          </h3>
          <form className="text-sm flex flex-col gap-2 py-2">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="sortBy"
                value="asc"
                checked={sortBy === "asc"}
                onChange={handleSortChange}
              />
              <label htmlFor="lowToHigh" className="cursor-pointer">
                Price - Low to High
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="sortBy"
                value="dsc"
                checked={sortBy === "dsc"}
                onChange={handleSortChange}
              />
              <label htmlFor="highToLow" className="cursor-pointer">
                Price - High to Low
              </label>
            </div>
          </form>

          <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 mt-4">
            Category
          </h3>
          <form className="text-sm flex flex-col gap-2 py-2">
            {productCategory.map((category) => (
              <div className="flex items-center gap-3" key={category.value}>
                <input
                  type="checkbox"
                  name="category"
                  value={category.value}
                  checked={!!selectedCategories[category.value]}
                  onChange={handleCategoryChange}
                />
                <label htmlFor={category.value}>{category.label}</label>
              </div>
            ))}
          </form>
        </div>

        {/* Right side */}
        {loading ? (
          <div className="flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
          </div>
        ) : (
          <div className="px-4">
            <p className="font-medium text-slate-800 text-lg my-2">
              Search Results: {data.length}
            </p>
            <div className="min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]">
              <VerticalCard data={data} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProduct;
