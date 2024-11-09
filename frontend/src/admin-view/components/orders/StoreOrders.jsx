import React, { useState } from "react";
import { IoIosCloseCircle, IoMdSearch } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchAllOrdersQuery } from "../../../redux/features/order/orderApi";
import LoadingTracking from "../../../components/LoadingTracking";
import ErrorInput from "../../../components/ErrorInput";

function StoreOrders() {
  const { status } = useParams();
  const [search, setSearch] = useState("");
  const [sortCriteria, setSortCriteria] = useState("New");
  const navigate = useNavigate();

  const preOrder = status
    .toLowerCase()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const capitalizeFirstLetter = (string) => {
    return string?.charAt(0).toUpperCase() + string?.slice(1).toLowerCase();
  };
  const {
    data: { orders = [] } = {},
    isLoading,
    error,
  } = useFetchAllOrdersQuery({ status: preOrder });

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${month}-${day}-${year}`;
  };

  const filterProducts = orders.filter((u) => {
    const title = `${u?.addressInfo?.name}`.toLowerCase();
    return title.includes(search.toLowerCase()) && u.orderStatus !== "";
  });
  const sortedUsers = [...filterProducts].sort((a, b) => {
    switch (sortCriteria) {
      case "A-Z":
        const nameA = `${a?.addressInfo?.name}`.toLowerCase();
        const nameB = `${b?.addressInfo?.name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      case "Z-A":
        const nameX = `${b?.addressInfo?.name}`.toLowerCase();
        const nameZ = `${a?.addressInfo?.name}`.toLowerCase();
        return nameX.localeCompare(nameZ);
      case "Newest":
        return new Date(b?.createdAt) - new Date(a?.createdAt);
      case "Oldest":
        return new Date(a?.createdAt) - new Date(b?.createdAt);
      default:
        return 0;
    }
  });

  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <IoIosCloseCircle
          className="text-red-400 text-[50px] cursor-pointer"
          onClick={() => navigate("/admin/orders")}
        />
      </div>
      <div className="flex-grow border-t border-black border-[2px]"></div>
      <h1 className="font-bold text-5xl text-center my-5">Store Products</h1>
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
              <th className="py-2 px-4 border">Order No.</th>
              <th className="py-2 px-4 border">Customer</th>
              <th className="py-2 px-4 border">Contact</th>
              <th className="py-2 px-4 border">Order Date</th>
              <th className="py-2 px-4 border">Payment Method</th>
              <th className="py-2 px-4 border">More Details</th>
            </tr>
          </thead>
          {}
          <tbody>
            {sortedUsers.map((order, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } border-b`}
              >
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  {order?.addressInfo?.name}
                </td>
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  +63{order?.addressInfo?.phone}
                </td>
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  {formatDate(order?.orderDate)}
                </td>
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  {capitalizeFirstLetter(order?.paymentMethod)}
                </td>
                <td className="py-2 px-4 border flex justify-center">
                  <button
                    className="bg-primary text-white py-1 px-3 rounded-[20px] hover:bg-primary"
                    onClick={() =>
                      navigate(`/admin/orders/${status}/${order?._id}`)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StoreOrders;
