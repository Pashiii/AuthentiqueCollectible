import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import {
  useDeleteProductMutation,
  useFetchAllProductsQuery,
} from "../../../redux/features/products/productApi";
import EditProducts from "./EditProducts";
import { useNavigate, useParams } from "react-router-dom";
import LoadingTracking from "../../../components/LoadingTracking";
import ErrorInput from "../../../components/ErrorInput";
function ProductsList() {
  const params = useParams();
  const { item } = params;
  const {
    data: { products = [] } = {},
    error,
    isLoading,
  } = useFetchAllProductsQuery(
    {},
    {
      pollingInterval: 1000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortCriteria, setSortCriteria] = useState("A-Z");
  const productPerPage = 15;
  const filterProducts = products.filter((u) => {
    const title = `${u.title}`.toLowerCase();
    return title.includes(search.toLowerCase());
  });
  const sortedUsers = [...filterProducts].sort((a, b) => {
    switch (sortCriteria) {
      case "A-Z":
        const nameA = `${a.title}`.toLowerCase();
        const nameB = `${b.title}`.toLowerCase();
        return nameA.localeCompare(nameB);
      case "Z-A":
        const nameX = `${b.title}`.toLowerCase();
        const nameZ = `${a.title}`.toLowerCase();
        return nameX.localeCompare(nameZ);
      case "Newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "Oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const indexOfLastUser = currentPage * productPerPage;
  const indexOfFirstUser = indexOfLastUser - productPerPage;
  const currentProd = sortedUsers
    .slice(indexOfFirstUser, indexOfLastUser)
    .filter((e) => e.item == capitalizeFirstLetter(item));

  const totalPages = Math.ceil(sortedUsers.length / productPerPage);
  const [deleteProduct] = useDeleteProductMutation();

  const handleArchive = async (archive) => {
    console.log(archive);
    try {
      await deleteProduct(archive).unwrap();
      console.log(`Product with ID ${archive} deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete the product: ", error);
    }
  };

  const handleAddProducts = (item) => {
    navigate("/admin/products/creation", {
      state: { item },
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex-grow border-t border-black border-[2px]"></div>

        <div className="flex items-center pt-2 justify-between ">
          <div className="flex items-center justify-between relative w-[25%] bg-red-500">
            <input
              type="text"
              placeholder="Search..."
              className="border-black border-[1px] w-full outline-none bg-secondary p-1 "
              onChange={(e) => setSearch(e.target.value)}
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
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              <option value="Newest">New</option>
              <option value="Oldest">Old</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center items-center pt-3">
          <table className="min-w-full bg-gray-200 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-2 px-4 border">Product No.</th>
                <th className="py-2 px-4 border">Product Image</th>
                <th className="py-2 px-4 border">Product Name</th>
                <th className="py-2 px-4 border">Category</th>
                <th className="py-2 px-4 border">Unit Price</th>
                <th className="py-2 px-4 border">Sale Type</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProd.map((product, i) => (
                <tr
                  key={product._id}
                  className={`${
                    i % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } border-b`}
                >
                  <td className="text-center">
                    <h1 className="text-xl font-bold">{i + 1}</h1>
                  </td>
                  <td>
                    <div className="flex justify-center items-center">
                      <img
                        src={product.image[0].url}
                        alt="Product"
                        className="w-[80px] h-[100px] object-cover border-black border-[1px] rounded-[10px]"
                      />
                    </div>
                  </td>
                  <td className="text-center">
                    <h1 className="text-xl font-bold">{product?.title}</h1>
                  </td>
                  <td className="text-center">
                    <h1 className="text-xl">{product?.category}</h1>
                  </td>
                  <td className="text-center">
                    <h1 className="text-xl">{product?.price}</h1>
                  </td>
                  <td className="text-center">
                    <h1 className="text-xl">{product?.properties?.saleType}</h1>
                  </td>
                  <td>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="bg-blue-600 text-white py-1 px-6 rounded-[20px] hover:bg-primary"
                        onClick={() =>
                          navigate(
                            `/admin/products/${item}/${product?.slug}/update`
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-400 text-white py-1 px-3 rounded-[20px] hover:bg-primary"
                        onClick={() => handleArchive(product?._id)}
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
        <div className="flex justify-center items-center pt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="mt-10">
          <button
            className="bg-secondary px-10 py-2 rounded-[20px] text-xl font-bold"
            onClick={() => handleAddProducts(item)}
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductsList;
