import React, { useState } from "react";
import { IoIosCloseCircle, IoMdSearch } from "react-icons/io";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useFetchAllCategoryQuery,
} from "../redux/features/category/categoryApi";
import { MdError } from "react-icons/md";
import LoadingTracking from "../components/LoadingTracking";
import ErrorInput from "../components/ErrorInput";
import RemoveCategory from "./components/alert/RemoveCategory";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function CategoryAdmin() {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useFetchAllCategoryQuery(undefined, {
    pollingInterval: 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { type } = useParams();

  const [isAddCategoryPopupOpen, setIsAddCategoryPopupOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState();
  const [addCategory] = useAddCategoryMutation();
  const [search, setSearch] = useState("");
  const [sortCriteria, setSortCriteria] = useState("New");
  const [deleteCategory] = useDeleteCategoryMutation();
  const [alert, setAlert] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [productType, setProductType] = useState("");

  const handleAlert = (e) => {
    setAlert(true);
    setCategoryId(e);
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await deleteCategory(categoryId).unwrap();
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
      setAlert(false);
      console.log(`Category with ID ${categoryId} deleted successfully.`);
    } catch (error) {
      const errorMessage =
        error?.data?.message || "Failed to delete the category";
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
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const data = {
      productType,
      category: category,
    };
    console.log(data);
    try {
      const response = await addCategory(data).unwrap();
      setIsAddCategoryPopupOpen(false);
      setCategory("");
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
      const errorMessage = error?.data?.message || "Category exist";
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
      setMessage("Category exist");
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  const filterType = categories.filter(
    (e) => e.productType === capitalizeFirstLetter(type)
  );

  const filterCategory = filterType.filter((u) => {
    const title = `${u.category}`.toLowerCase();
    return title.includes(search.toLowerCase());
  });

  const sortedCategory = [...filterCategory].sort((a, b) => {
    switch (sortCriteria) {
      case "A-Z":
        const nameA = `${a.category}`.toLowerCase();
        const nameB = `${b.category}`.toLowerCase();
        return nameA.localeCompare(nameB);
      case "Z-A":
        const nameX = `${b.category}`.toLowerCase();
        const nameZ = `${a.category}`.toLowerCase();
        return nameX.localeCompare(nameZ);
      case "Newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "Oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  const handleCloseAddCategoryPopup = () => {
    setIsAddCategoryPopupOpen(false);
    setCategory("");
    setMessage("");
  };
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div>
      {alert && (
        <RemoveCategory
          setAlert={setAlert}
          categoryId={categoryId}
          handleDelete={handleDelete}
        />
      )}

      <h1 className="text-3xl font-bold">Category Items</h1>
      <div className="flex-grow border-t border-black border-[2px]"></div>
      <div className="flex items-center pt-2 justify-between ">
        <div className="flex items-center justify-between relative w-[25%] bg-red-500">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            className="border-black border-[1px] w-full outline-none bg-secondary p-1 "
          />
          <IoMdSearch className="absolute right-2" />
        </div>
        <div className="flex justify-center items-center">
          <h1>Sort by: </h1>
          <select
            className="ml-2 border border-black bg-secondary p-1"
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <option value="Newest">New</option>
            <option value="Oldest">Old</option>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
          </select>
        </div>
      </div>
      <div className="flex justify-center items-center pt-3">
        <table className="min-w-full bg-gray-200 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-primary text-white">
              <th className="py-2 px-4 border w-[30%]">Category Number</th>
              <th className="py-2 px-4 border w-[50%] ">Category</th>
              <th className="py-2 px-4 border w-[30%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategory.map((category, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-gray-100" : "bg-white"
                } border-b`}
              >
                <td className="py-2 px-4 border text-center font-bold">
                  {i + 1}
                </td>
                <td className="py-2 px-4 border text-center font-semibold">
                  {category?.category}
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex justify-center items-center">
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-[20px] hover:bg-primary"
                      onClick={() => handleAlert(category?._id)}
                    >
                      Archive
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-10">
        <button
          className="bg-secondary px-10 py-2 rounded-[20px] text-xl font-bold"
          onClick={() => setIsAddCategoryPopupOpen(true)}
        >
          Add Category
        </button>
      </div>

      {isAddCategoryPopupOpen && (
        <>
          <div className="fixed top-0 left-0 w-full h-screen bg-black opacity-70"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary rounded-[35px] px-40 p-10 z-51">
            <h1 className="text-4xl font-bold">New Category of Item</h1>
            <IoIosCloseCircle
              className="text-red-400 text-[40px] absolute right-2 top-2 cursor-pointer"
              onClick={handleCloseAddCategoryPopup}
            />
            <div className="flex flex-col gap-2 pt-12">
              <h1 className="text-center  text-2xl">Product Type</h1>
              <select
                value={productType}
                className="border-black border-2 rounded-[10px] p-2 bg-transparent"
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
              <h1 className="text-center  text-2xl">Category Name</h1>
              <input
                type="text"
                className="border-black border-2 rounded-[10px] p-2 bg-transparent"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              {message && (
                <p className="text-red-400 flex items-center gap-2 text-lg mb-2">
                  <MdError />
                  {message}
                </p>
              )}
              <button
                className="bg-primary my-20 p-2 rounded-[20px] text-white"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CategoryAdmin;
