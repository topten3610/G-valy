import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import VerticalCard from "../components/VerticalCard";
import SummaryApi from "../common";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");

  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach((el) => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.filterProduct.url, {
      method: SummaryApi.filterProduct.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        category: filterCategoryList,
      }),
    });

    const dataResponse = await response.json();
    setData(dataResponse?.data || []);
    setLoading(false);
  };

  const handleSelectCategory = (e) => {
    const { name, value, checked } = e.target;

    setSelectCategory((prev) => {
      return {
        ...prev,
        [value]: checked,
      };
    });
  };

  useEffect(() => {
    fetchData();
  }, [filterCategoryList]);

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory)
      .map((categoryKeyName) => {
        if (selectCategory[categoryKeyName]) {
          return categoryKeyName;
        }
        return null;
      })
      .filter((el) => el);

    setFilterCategoryList(arrayOfCategory);

    const urlFormat = arrayOfCategory.map((el, index) => {
      if (arrayOfCategory.length - 1 === index) {
        return `category=${el}`;
      }
      return `category=${el}&&`;
    });

    navigate("/product-category?" + urlFormat.join(""));
  }, [selectCategory]);

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;

    setSortBy(value);

    if (value === "asc") {
      setData((prev) => prev.sort((a, b) => a.sellingPrice - b.sellingPrice));
    }

    if (value === "dsc") {
      setData((prev) => prev.sort((a, b) => b.sellingPrice - a.sellingPrice));
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      <div className="lg:hidden">
        {/* Mobile version - Filters */}
        <div className="bg-white p-4 mb-4">
          <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300">
            Sort by
          </h3>
          <div className="text-sm flex flex-col gap-2 py-2">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="sortBy"
                checked={sortBy === "asc"}
                onChange={handleOnChangeSortBy}
                value={"asc"}
              />
              <label>Price - Low to High</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="sortBy"
                checked={sortBy === "dsc"}
                onChange={handleOnChangeSortBy}
                value={"dsc"}
              />
              <label>Price - High to Low</label>
            </div>
          </div>
          <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300 mt-4">
            Category
          </h3>
          <div className="text-sm flex flex-col gap-2 py-2">
            {productCategory.map((categoryName) => (
              <div className="flex items-center gap-3" key={categoryName.value}>
                <input
                  type="checkbox"
                  name={"category"}
                  checked={selectCategory[categoryName?.value]}
                  value={categoryName?.value}
                  id={categoryName?.value}
                  onChange={handleSelectCategory}
                />
                <label htmlFor={categoryName?.value}>
                  {categoryName?.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-[200px,1fr] gap-4">
        {/* Desktop version - Left side */}
        <div className="bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll">
          <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300">
            Sort by
          </h3>
          <form className="text-sm flex flex-col gap-2 py-2">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="sortBy"
                checked={sortBy === "asc"}
                onChange={handleOnChangeSortBy}
                value={"asc"}
              />
              <label>Price - Low to High</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="sortBy"
                checked={sortBy === "dsc"}
                onChange={handleOnChangeSortBy}
                value={"dsc"}
              />
              <label>Price - High to Low</label>
            </div>
          </form>

          <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300 mt-4">
            Category
          </h3>
          <form className="text-sm flex flex-col gap-2 py-2">
            {productCategory.map((categoryName) => (
              <div className="flex items-center gap-3" key={categoryName.value}>
                <input
                  type="checkbox"
                  name={"category"}
                  checked={selectCategory[categoryName?.value]}
                  value={categoryName?.value}
                  id={categoryName?.value}
                  onChange={handleSelectCategory}
                />
                <label htmlFor={categoryName?.value}>
                  {categoryName?.label}
                </label>
              </div>
            ))}
          </form>
        </div>

        {/* Desktop version - Right side */}
        <div className="px-4">
          <p className="font-medium text-slate-800 text-lg my-2">
            Search Results: {data.length}
          </p>
          <div className="min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]">
            {data.length !== 0 && <VerticalCard data={data} />}
          </div>
        </div>
      </div>

      {/* Mobile version - Product grid */}
      <div className="lg:hidden">
        <p className="font-medium text-slate-800 text-lg my-2">
          Search Results: {data.length}
        </p>
        <VerticalCard data={data} />
      </div>
    </div>
  );
};

export default CategoryProduct;
