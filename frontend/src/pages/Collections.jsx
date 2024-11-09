import React, { useEffect, useState } from "react";
import Slider from "react-slider";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorInput from "../components/ErrorInput";
import { useFetchAllProductsQuery } from "../redux/features/products/productApi";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../redux/features/cart/notificationSlice";
import { addtoCart } from "../redux/features/cart/cartSlice";
import LoadingTracking from "../components/LoadingTracking";

function Collections() {
  const MIN = 100;
  const MAX = 100000;
  const navigate = useNavigate();

  const [checkedCategories, setCheckedCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [ProductsPerPage] = useState(10);
  const [sortCriteria, setSortCriteria] = useState("New");

  const params = useParams();
  const { item } = params;
  const itemName = item
    .toLowerCase()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const {
    data: { products = [], totalPages, totalProducts } = {},
    error,
    isLoading,
    refetch,
  } = useFetchAllProductsQuery(
    {
      saleType: itemName,
      category: itemName,
      item: itemName,
      page: currentPage,
      limit: ProductsPerPage,
    },
    { pollingInterval: 1000, refetchOnFocus: true, refetchOnReconnect: true }
  );

  useEffect(() => {
    setCurrentPage(1);
    refetch();
  }, [item, refetch]);

  const categories = [...new Set(products.map((item) => item.category))];

  const [values, setValues] = useState([MIN, MAX]);
  const [isFiltering, setIsFiltering] = useState(false);

  const handleSliderChange = (newValues) => {
    setValues(newValues);
    setIsFiltering(true);
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
    setIsFiltering(true);
  };

  useEffect(() => {
    setIsFiltering(false);
  }, [values, products, checkedCategories, sortCriteria]);

  const handleCategoryChange = (category) => {
    setCheckedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setIsFiltering(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    refetch();
  }, [currentPage, refetch]);

  const filteredProducts = products.filter(
    (product) =>
      product.price >= values[0] &&
      product.price <= values[1] &&
      product?.stocks > 0 &&
      (checkedCategories.length === 0 ||
        checkedCategories.includes(product.category))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortCriteria) {
      case "New":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "Oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "Lowest Price":
        return a.price - b.price;
      case "Highest Price":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const titleProduct = item.toUpperCase().split("-").join(" ");

  const navigateHandler = (item) => {
    navigate(`/product/${item}`);
  };

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x.slug === item.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item.slug}`);
    if (data.product.stocks < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch(
      showNotification({
        message: "Successfully added to Cart",
        title: item.title,
        image: item.image[0].url,
      })
    );
    dispatch(addtoCart({ ...item, quantity }));
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      refetch();
    }
  };

  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;

  const startProduct = (currentPage - 1) * ProductsPerPage + 1;
  const endProduct = startProduct + products.length - 1;
  return (
    <div className="container min-h-screen max-h-full">
      {/* <div className="overflow-hidden max-w-[2000px] h-[450px] sm:h-[780px] w-full m-auto py-16 px-4 relative group">
        <div
          style={{ backgroundImage: `url(${slides[0].url})` }}
          className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
        ></div>
      </div> */}

      <div className="max-w-screen-xl mx-auto py-10">
        <h1 className=" mb-5 text-3xl font-bold">{titleProduct}</h1>
        <div className="flex text-lg">
          <h1 className="hidden lg:flex w-[330px]">FILTER</h1>
          <h1 className="flex-auto">{filteredProducts.length} Products</h1>
          <div className="flex justify-center items-center">
            <h1>Sort by: </h1>
            <select
              className="ml-2 border border-black bg-secondary p-1"
              value={sortCriteria}
              onChange={(e) => handleSortChange(e)}
            >
              <option value="Newest">New</option>
              <option value="Oldest">Old</option>
              <option value="Lowest Price">Lowest price</option>
              <option value="Highest Price">Highest price</option>
            </select>
          </div>
        </div>
        <div className="flex pt-5">
          <div className="hidden lg:flex w-[500px] xl:w-[350px] 2xl:w-[400px] min-w-[330px]">
            <div className="w-[250px]">
              {item === "apparels" ? (
                <>
                  <h1 className="text-lg font-semibold">APPARELS CATEGORY</h1>
                </>
              ) : (
                <>
                  <h1 className="text-lg font-semibold">
                    TOY COLLECTIBLES CATEGORY
                  </h1>
                </>
              )}
              {categories.map((myCategory, i) => (
                <div key={i} className=" flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checkedCategories.includes(myCategory)}
                    onChange={() => handleCategoryChange(myCategory)}
                    className="cursor-pointer"
                  />{" "}
                  <h1>{myCategory}</h1>
                </div>
              ))}

              <div className="flex-grow border-t border-gray-500 border-[1px] my-3"></div>
              <h1>Price</h1>
              <Slider
                className="slider"
                value={values}
                min={MIN}
                max={MAX}
                onChange={handleSliderChange}
              />
              <div className="flex justify-between my-5">
                <div className="border-[1px] border-black w-[100px] px-2 flex justify-between">
                  <p>₱</p>
                  <p>
                    {values[0].toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <p>to</p>
                <div className="border-[1px] border-black w-[100px] px-2 flex justify-between">
                  <p>₱</p>
                  <p>
                    {values[1].toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex-grow border-t border-gray-500 border-[1px]"></div>
            </div>
          </div>
          <div className="max-w-screen-xl mx-auto py-10 mb-10">
            <div className="flex pb-[50px]">
              <div className="grid grid-cols-3 lg:grid-cols-3 gap-4">
                {isFiltering ? (
                  <div className="col-span-full text-center py-10">
                    Filtering products...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="col-span-full text-center py-10">
                    No products match your filter criteria.
                  </div>
                ) : (
                  sortedProducts.map((item) => (
                    <div
                      key={item._id}
                      data-aos="fade-up"
                      data-aos-delay={item.aosDelay}
                    >
                      <div className="border-black border-[1px] rounded-[10px] shadow-xl">
                        <h1 className="text-sm sm:text-base text-right px-3 pt-2 text-gray-500">
                          Stocks: {item.stocks}
                        </h1>
                        <div className="w-full h-50 lg:h-75 xl:h-96 group cursor-pointer overflow-hidden">
                          <img
                            className="img-filter w-full h-full object-cover group-hover:scale-110 duration-500"
                            src={item.image[0].url}
                            alt=""
                            onClick={() => navigateHandler(item.slug)}
                          />
                        </div>
                        <h1 className="text-base sm:text-xl font-bold text-center truncate mx-5">
                          {item.title}
                        </h1>
                        <h1 className="text-[13px] sm:text-base md:text-sm text-center sm:py-2">
                          {item.category}
                        </h1>
                        <h1 className="text-[18px] sm:text-xl font-semibold text-red-500 text-center">
                          ₱
                          {item.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </h1>
                        <div className="flex justify-center pt-2 pb-5">
                          {item.stocks === 0 ? (
                            <button
                              type="button"
                              className="bg-red-500 cursor-not-allowed rounded-[5px] p-auto py-1 mx-3 text-white font-semibold container"
                            >
                              Out of Stocks
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="border-black border-[1px] rounded-[5px] font-semibold p-2 mx-3 container hover:bg-primary hover:text-white "
                              onClick={() => addToCartHandler(item)}
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                      {item.properties?.saleType === "Pre Order" && (
                        <div className="absolute top-14 right-0">
                          <h1 className="bg-primary text-white rounded-l-[20px] px-3 py-[5px] font-bold text-lg">
                            Pre Order
                          </h1>
                        </div>
                      )}
                      {item.properties?.saleType === "Flash Sale" && (
                        <div className="absolute top-14 right-0">
                          <h1 className="bg-red-500 text-white rounded-l-[20px] px-5 py-[5px] font-bold text-lg">
                            Sale
                          </h1>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div
              className="mt-6 flex justify-center"
              data-aos="fade-up"
              data-aos-delay={item.aosDelay}
            >
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 ${
                    currentPage === index + 1
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-700"
                  }
                      rounded-md mx-1`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-2"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collections;
