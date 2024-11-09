import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useFetchAllCategoryQuery } from "../../../redux/features/category/categoryApi";
import {
  useFetchProductBySlugQuery,
  useUpdateProductMutation,
} from "../../../redux/features/products/productApi";
import { LuTrash } from "react-icons/lu";
import LoadingTracking from "../../../components/LoadingTracking";
import ErrorInput from "../../../components/ErrorInput";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function EditProducts() {
  const { slug, item } = useParams();
  const { data: { product = [] } = {} } = useFetchProductBySlugQuery(slug, {
    pollingInterval: 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [hidePricing, setHidePricing] = useState("");
  const [deadLine, setDeadLine] = useState({ month: "", day: "", year: "" });
  const [timeArrival, setTimeArrival] = useState({
    month: "",
    day: "",
    year: "",
  });
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [stocks, setStocks] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [itemStatus, setItemStatus] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState({ month: "", day: "", year: "" });
  const [initialPay, setInitialPay] = useState(0);
  const [images, setImages] = useState([]);
  const [salePrice, setSalePrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [discounted, setDiscounted] = useState("");

  useEffect(() => {
    if (product.title && product.category) {
      setProductType(product.item);
      setDescription(product.description);
      setCategory(product.category);
      setProductName(product.title);
      setStocks(product.stocks);
      setItemStatus(product?.properties?.saleType);
      setPrice(product.price);
      setImages(product.image.map((i) => i.url));
      setHidePricing(product?.properties?.saleType);
    }
    if (product.properties?.saleType === "Flash Sale") {
      setPrice(product.oldPrice);
      setSalePrice(product.price);
      setDiscounted(product.percent || "0%");

      const endDate = new Date(product.properties.timeEnd);

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      setTimeEnd({
        day: endDate.getDate(),
        month: months[endDate.getMonth()],
        year: endDate.getFullYear(),
      });
    }
    if (product?.properties?.saleType === "Pre Order") {
      setDownPayment(product.percent || "0%");
      setInitialPay(product.properties.initialPay);
      const deadl = new Date(product.properties.deadLine);
      const ETA = new Date(product.properties.eta);

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      setDeadLine({
        day: deadl.getDate(),
        month: months[deadl.getMonth()],
        year: deadl.getFullYear(),
      });
      setTimeArrival({
        day: ETA.getDate(),
        month: months[ETA.getMonth()],
        year: ETA.getFullYear(),
      });
    }
  }, [product]);

  const navigate = useNavigate();
  useEffect(() => {
    const downPaymentValue = parseFloat(downPayment.replace("%", ""));

    const calculatediscount = (price * downPaymentValue) / 100;

    setInitialPay(calculatediscount || 0);
  }, [price, downPayment]);

  useEffect(() => {
    const discountValue = parseFloat(discounted.replace("%", ""));

    const calculate = (price * discountValue) / 100;
    setSalePrice(price - calculate || 0);
  });
  const [updateProduct] = useUpdateProductMutation();

  const handleAddProducts = async (e) => {
    e.preventDefault();
    let items = [];

    const formatTimeEnd = (timeEnd) => {
      const { day, month, year } = timeEnd;
      return `${day}-${month}-${year}`;
    };
    if (itemStatus == "Pre Order") {
      const data = {
        properties: {
          saleType: itemStatus || "",
          initialPay: initialPay || 0,
          deadLine: formatTimeEnd(deadLine) || "",
          eta: formatTimeEnd(timeArrival) || "",
        },
        item: productType,
        category: category,
        title: productName,
        stocks: stocks,
        price: price,
        imageURL: images,
        description: description,
        percent: downPayment,
      };
      items = data;
    }
    if (itemStatus == "Flash Sale") {
      const data = {
        properties: {
          saleType: itemStatus || "",
          timeEnd: formatTimeEnd(timeEnd),
        },
        item: productType,
        category: category,
        title: productName,
        stocks: stocks,
        oldPrice: price,
        price: salePrice,
        imageURL: images,
        description: description,
        percent: discounted,
      };
      items = data;
    }
    if (itemStatus == "Latest Product") {
      const data = {
        properties: {
          saleType: itemStatus || "",
        },
        item: productType,
        category: category,
        title: productName,
        stocks: stocks,
        price: price,
        imageURL: images,
        description: description,
      };
      items = data;
    }
    console.log(items);
    try {
      const response = await updateProduct({
        id: product._id,
        updatedProduct: items,
      }).unwrap();
      console.log("Success update");
      toast.success(response.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to update";
      console.log(errorMessage);
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() + i
  );

  // const handleImageChange = (e) => {
  //   const files = e.target.files[0];
  //   const updatedImages = [...images];

  //   // Loop through each selected file and read it as a data URL
  //   files.forEach((file, index) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       // If the index is greater than the current length of images, push to the array
  //       if (index >= updatedImages.length) {
  //         updatedImages.push(reader.result);
  //       } else {
  //         updatedImages[index] = reader.result; // Replace existing image if it's already in the array
  //       }
  //       setImages(updatedImages);
  //     };
  //     reader.readAsDataURL(file); // Convert the file to base64
  //   });
  // };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImages((prevImages) => [...prevImages, reader.result]);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
    console.log(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImages((prevImages) => [...prevImages, reader.result]);
    };
  };

  const {
    data: categories = [],
    isLoading,
    error,
  } = useFetchAllCategoryQuery();
  const filterCategory = categories.filter(
    (e) => e.productType === productType
  );
  if (isLoading) {
    return <LoadingTracking />;
  }

  if (error) {
    return <ErrorInput />;
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Add Products</h1>
        <IoIosCloseCircle
          className="text-red-400 text-[50px] cursor-pointer"
          onClick={() => navigate(`/admin/products/${item}`)}
        />
      </div>
      <form onSubmit={handleAddProducts}>
        <div className="flex-grow border-t border-black border-[2px]"></div>
        <div className="mt-24">
          <h1 className="text-3xl font-bold">Product Details</h1>
          <div className="flex-grow border-t border-black border-[2px]"></div>

          <div className="flex items-center space-x-4 mt-5">
            <label className="flex items-center">
              <input
                type="radio"
                name="productType"
                value={itemStatus}
                className="hidden peer"
                checked={itemStatus === "Pre Order"}
                onChange={() => {
                  setHidePricing("Pre Order");
                  setItemStatus("Pre Order");
                  setDeadLine({ month: "", day: "", year: "" });
                  setTimeArrival({ month: "", day: "", year: "" });
                  setPrice(0);
                  setDownPayment("");
                  setSalePrice(0);
                  setInitialPay(0);
                }}
              />
              <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-transparent"></span>
              <span className="ml-2 text-gray-700 text-3xl">Pre Order</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="productType"
                value={itemStatus}
                className="hidden peer"
                checked={itemStatus === "Latest Product"}
                onChange={() => {
                  setHidePricing("Latest Product");
                  setDeadLine({ month: "", day: "", year: "" });
                  setTimeArrival({ month: "", day: "", year: "" });
                  setItemStatus("Latest Product");
                  setDeadLine({ month: "", day: "", year: "" });
                  setTimeArrival({ month: "", day: "", year: "" });
                  setPrice(0);
                  setDownPayment("");
                  setSalePrice(0);
                  setInitialPay(0);
                }}
              />
              <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-transparent"></span>
              <span className="ml-2 text-gray-700 text-3xl">
                Latest Product
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="productType"
                value={itemStatus}
                className="hidden peer"
                checked={itemStatus === "Flash Sale"}
                onChange={() => {
                  setHidePricing("Flash Sale");
                  setDeadLine({ month: "", day: "", year: "" });
                  setTimeArrival({ month: "", day: "", year: "" });
                  setItemStatus("Flash Sale");
                  setDeadLine({ month: "", day: "", year: "" });
                  setTimeArrival({ month: "", day: "", year: "" });
                  setPrice(0);
                  setDownPayment("");
                  setSalePrice(0);
                  setInitialPay(0);
                }}
              />
              <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-transparent"></span>
              <span className="ml-2 text-gray-700 text-3xl">Flash Sales</span>
            </label>
          </div>
          <div className="mt-10 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">Product type</label>
            <select
              value={productType}
              className="ml-10 border border-black bg-secondary  rounded-[10px] px-5 py-2"
              onChange={(e) => setProductType(e.target.value)}
            >
              <option value="" disabled className="text-xl">
                Select product type
              </option>
              <option value="Collectible" className="text-xl">
                Collectibles
              </option>
              <option value="Apparel" className="text-xl">
                Apparel
              </option>
              <option value="Coffee" className="text-xl">
                Coffee
              </option>
            </select>
          </div>
          <div className="mt-5 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">Category</label>

            <select
              value={category}
              className="ml-10 border border-black bg-secondary  rounded-[10px] px-5 w-[200px] py-2"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled className="text-xl">
                Select category
              </option>
              {filterCategory.map((categories, i) => (
                <option key={i} className="text-xl">
                  {categories.category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-12">
          <h1 className="text-3xl font-bold">Product Details</h1>
          <div className="flex-grow border-t border-black border-[2px]"></div>
          <div className="mt-5 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">Product Name</label>
            <input
              type="text"
              className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[40vh]"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="mt-5 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">Stocks</label>
            <input
              type="number"
              value={stocks}
              className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[22vh]"
              onChange={(e) => setStocks(e.target.value)}
              required
            />
          </div>
          <div className="mt-5 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">Description</label>
            <textarea
              type="text"
              className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[40vh]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-5 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">
              Product Pictures
            </label>
            <div className="flex flex-col ">
              <label className="text-lg font-semibold ml-10">
                Main Picture
              </label>
              <input
                type="file"
                accept="image/*"
                className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[40vh]"
                onChange={handleImageChange}
                multiple
              />
            </div>
          </div>
          <div className="flex gap-2 ">
            {images.map((image, i) => (
              <div
                className="border border-gray-400 rounded m-2 relative"
                key={i}
              >
                <img
                  src={image}
                  alt={`Preview ${i}`}
                  className=" object-cover "
                />
                <button
                  onClick={() =>
                    setImages((prevImages) =>
                      prevImages.filter((_, x) => x !== i)
                    )
                  }
                  className="absolute top-0 right-0 m-3 text-xl text-white bg-red-500 p-1 rounded-[10px]"
                >
                  <LuTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
        {hidePricing === "Pre Order" && (
          <div className="mt-12">
            <h1 className="text-3xl font-bold">Date Information</h1>
            <div className="flex-grow border-t border-black border-[2px]"></div>
            <div className="mt-16 flex items-center">
              <label className="text-3xl font-bold w-[35vh]">Deadline</label>
              <div className="flex items-center gap-2 ">
                <select
                  value={deadLine.month}
                  className="border border-black bg-secondary  rounded-[10px] px-5  py-2"
                  onChange={(e) =>
                    setDeadLine((prev) => ({ ...prev, month: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Select Month...
                  </option>
                  {months.map((m) => (
                    <option key={m} value={m} className="text-black">
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={deadLine.day}
                  className=" border border-black bg-secondary  rounded-[10px] px-5 w-[200px] py-2"
                  onChange={(e) =>
                    setDeadLine((prev) => ({ ...prev, day: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Select Day...
                  </option>
                  {days.map((d) => (
                    <option key={d} value={d} className="text-black">
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={deadLine.year}
                  className="border border-black bg-secondary  rounded-[10px] px-5 w-[200px] py-2"
                  onChange={(e) =>
                    setDeadLine((prev) => ({ ...prev, year: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Select Year...
                  </option>
                  {years.map((y) => (
                    <option key={y} value={y} className="text-black">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-16 flex items-center">
              <label className="text-3xl font-bold w-[35vh]">
                Estimated Time Arrival(ETA)
              </label>
              <div className="flex items-center gap-2 ">
                <select
                  value={timeArrival.month}
                  className="border border-black bg-secondary  rounded-[10px] px-5  py-2"
                  onChange={(e) =>
                    setTimeArrival((prev) => ({
                      ...prev,
                      month: e.target.value,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select Month...
                  </option>
                  {months.map((m) => (
                    <option key={m} value={m} className="text-black">
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={timeArrival.day}
                  className=" border border-black bg-secondary  rounded-[10px] px-5 w-[200px] py-2"
                  onChange={(e) =>
                    setTimeArrival((prev) => ({ ...prev, day: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Select Day...
                  </option>
                  {days.map((d) => (
                    <option key={d} value={d} className="text-black">
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={timeArrival.year}
                  className="border border-black bg-secondary  rounded-[10px] px-5 w-[200px] py-2"
                  onChange={(e) =>
                    setTimeArrival((prev) => ({
                      ...prev,
                      year: e.target.value,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select Year...
                  </option>
                  {years.map((y) => (
                    <option key={y} value={y} className="text-black">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {(hidePricing === "Latest Product" || hidePricing === "") && (
          <>
            <div className="mt-20">
              <h1 className="text-3xl font-bold">Pricing Information</h1>
              <div className="flex-grow border-t border-black border-[2px]"></div>
              <div className="mt-5 flex items-center">
                <label className="text-3xl font-bold w-[30vh]">
                  Product Price
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[40vh]"
                />
              </div>
              <div className="mt-5 flex items-center">
                <label className="text-3xl font-bold w-[30vh]">
                  Total Price
                </label>
                <label className="text-3xl ml-10">
                  ₱
                  {price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 items-center m-10">
              <button
                type="submit"
                className="bg-green-400 px-5 py-2 text-white font-bold text-2xl rounded-[20px]"
              >
                Update Product
              </button>
              <button
                className="bg-primary px-[5vh] py-2 text-white font-bold text-2xl rounded-[20px]"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/admin/products/${item}`);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {hidePricing === "Pre Order" && (
          <>
            <div className="mt-20">
              <h1 className="text-3xl font-bold">Pricing Information</h1>
              <div className="flex-grow border-t border-black border-[2px]"></div>
              <div className="mt-5 flex items-center">
                <label className="text-3xl font-bold w-[30vh]">
                  Product Price
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[40vh]"
                />
              </div>
              <div className="mt-5 flex items-center">
                <label className="text-3xl font-bold w-[30vh]">
                  Down payment (%)
                </label>
                <select
                  value={downPayment}
                  className="ml-10 border border-black bg-secondary  rounded-[10px] px-5 w-[200px] py-2 flex justify-center items-center"
                  onChange={(e) => setDownPayment(e.target.value)}
                >
                  <option value="" disabled>
                    Select %
                  </option>
                  <option>0%</option>
                  <option>5%</option>
                  <option>10%</option>
                  <option>15%</option>
                  <option>20%</option>
                  <option>25%</option>
                  <option>30%</option>
                  <option>35%</option>
                  <option>40%</option>
                </select>
              </div>
              <div className="mt-5 flex items-center">
                <label className="text-3xl font-bold w-[30vh]">
                  Initial Price
                </label>
                <label className="text-3xl ml-10">
                  ₱
                  {initialPay?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </label>
              </div>
              <div className="mt-5 flex items-center">
                <label className="text-3xl font-bold w-[30vh]">
                  Total Price
                </label>
                <label className="text-3xl ml-10">
                  ₱
                  {price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 items-center m-10">
              <button
                type="submit"
                className="bg-green-400 px-5 py-2 text-white font-bold text-2xl rounded-[20px]"
              >
                Update Product
              </button>
              <button
                className="bg-primary px-[5vh] py-2 text-white font-bold text-2xl rounded-[20px]"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/admin/products/${item}`);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {hidePricing === "Flash Sale" && (
          <>
            <div className="mt-20">
              <h1 className="text-3xl font-bold">Date Information</h1>
              <div className="flex-grow border-t border-black border-[2px]"></div>
              <div className="my-16 flex items-center">
                <label className="text-3xl font-bold w-[35vh]">Deadline</label>
                <div className="flex items-center gap-2 ">
                  <select
                    value={timeEnd.month}
                    className="border border-black bg-secondary  rounded-[10px] px-5  py-2"
                    onChange={(e) =>
                      setTimeEnd((prev) => ({
                        ...prev,
                        month: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Select Month...
                    </option>
                    {months.map((m) => (
                      <option key={m} value={m} className="text-black">
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    value={timeEnd.day}
                    className=" border border-black bg-secondary  rounded-[10px] px-5 w-[200px] py-2"
                    onChange={(e) =>
                      setTimeEnd((prev) => ({ ...prev, day: e.target.value }))
                    }
                  >
                    <option value="" disabled>
                      Select Day...
                    </option>
                    {days.map((d) => (
                      <option key={d} className="text-black">
                        {d}
                      </option>
                    ))}
                  </select>
                  <select
                    value={timeEnd.year}
                    className="border border-black bg-secondary  rounded-[10px] px-5 w-[200px] py-2"
                    onChange={(e) =>
                      setTimeEnd((prev) => ({ ...prev, year: e.target.value }))
                    }
                  >
                    <option value="" disabled>
                      Select Year...
                    </option>
                    {years.map((y) => (
                      <option key={y} value={y} className="text-black">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <h1 className="text-3xl font-bold">Pricing Information</h1>
              <div className="flex-grow border-t border-black border-[2px]"></div>
              <div className="mt-5 flex items-center">
                <label className="text-3xl font-bold w-[30vh]">
                  Product Price
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[40vh]"
                />
              </div>
              <div className="mt-5 flex items-center">
                <label className="text-3xl font-bold w-[30vh]">
                  Discount (%)
                </label>
                <select
                  value={discounted}
                  className="ml-10 border border-black bg-secondary  rounded-[10px] px-5 w-[200px] py-2 flex justify-center items-center"
                  onChange={(e) => setDiscounted(e.target.value)}
                >
                  <option value="" disabled>
                    Select %
                  </option>
                  <option>0%</option>
                  <option>5%</option>
                  <option>10%</option>
                  <option>20%</option>
                  <option>25%</option>
                  <option>30%</option>
                  <option>35%</option>
                  <option>40%</option>
                </select>
              </div>
              <div className="mt-5 flex items-center">
                <label className="text-3xl font-bold w-[30vh]">
                  Total Price
                </label>
                <label className="text-3xl ml-10">
                  ₱
                  {price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </label>
              </div>
              <div className="mt-5 flex items-center">
                <label className="text-3xl font-bold w-[30vh]">
                  Sale Price
                </label>
                <label className="text-3xl ml-10">
                  ₱
                  {salePrice?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 items-center m-10">
              <button
                type="submit"
                className="bg-green-400 px-5 py-2 text-white font-bold text-2xl rounded-[20px]"
              >
                Update Product
              </button>
              <button
                className="bg-primary px-[5vh] py-2 text-white font-bold text-2xl rounded-[20px]"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/admin/products/${item}`);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default EditProducts;
