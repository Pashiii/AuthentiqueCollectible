import React from "react";
import { IoIosPeople } from "react-icons/io";
import { BiSolidCategory } from "react-icons/bi";
import { IoDiamondOutline } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";
import { useGetUserQuery } from "../redux/features/auth/authApi";
import { useFetchAllCategoryQuery } from "../redux/features/category/categoryApi";
import { useFetchAllProductsQuery } from "../redux/features/products/productApi";
import { useFetchAllAuctionQuery } from "../redux/features/auction/auctionApi";
import LoadingTracking from "../components/LoadingTracking";
import ErrorInput from "../components/ErrorInput";
import { useFetchAllOrdersQuery } from "../redux/features/order/orderApi";
import { Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import PieProducts from "./components/graphs/PieProducts";

Chart.register(...registerables);

function DashboardAdmin() {
  const { data: users = [] } = useGetUserQuery();
  const { data: category = [] } = useFetchAllCategoryQuery();
  const {
    data: { products = [] } = {},
    isLoading,
    error,
  } = useFetchAllProductsQuery({});
  const { data: { orders = [] } = {} } = useFetchAllOrdersQuery({});
  const { data: auction = [] } = useFetchAllAuctionQuery();

  const isWithinLast3Days = (date) => {
    const today = new Date();
    const orderDate = new Date(date);

    const timeDiff = today - orderDate;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    return daysDiff <= 3 && daysDiff >= 0;
  };

  console.log(products);
  const collectible = products.filter((e) => e.item === "Collectible");

  const apparel = products.filter((e) => e.item === "Apparel");

  const coffee = products.filter((e) => e.item === "Coffee");
  const productData = {
    flashSale: collectible.length, // Example data for Flash Sale
    preOrder: apparel.length, // Example data for Pre Order
    latestProduct: coffee.length, // Example data for Latest Product
  };

  const recentOrders = orders.filter((e) => isWithinLast3Days(e.orderDate));

  const getWeeklySalesData = () => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const salesPerDay = new Array(7).fill(0);
    const reservationsPerDay = new Array(7).fill(0);

    orders.forEach((order) => {
      const orderDay = new Date(order.orderDate).getDay();
      if (order.orderStatus === "Received") {
        salesPerDay[orderDay - 1]++;
      } else if (order.status === "To Pickup") {
        reservationsPerDay[orderDay - 1]++;
      }
    });

    return { salesPerDay, reservationsPerDay };
  };

  const weeklyData = getWeeklySalesData();

  const salesData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Total Items Sold",
        data: weeklyData.salesPerDay,
        borderColor: "#FF6384",
        backgroundColor: "#FF6384",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Total Items Reserved",
        data: weeklyData.reservationsPerDay,
        borderColor: "#36A2EB",
        backgroundColor: "#36A2EB",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div className="">
      <h1 className="text-3xl font-bold">Authentique Collectibles Dashboard</h1>
      <div className="flex-grow border-t border-black border-[2px]"></div>
      <ul className="flex justify-between w-full pt-10 pb-5">
        <li className="border-2 border-black p-[100px] flex flex-col justify-center items-center rounded-[20px] bg-secondary relative">
          <IoIosPeople className="absolute top-1 left-2 text-[5vh]" />
          <h1 className="text-[10vh] font-bold ">{users.length}</h1>
          <h2 className="text-[30px]">Total User</h2>
        </li>
        <li className="border-2 border-black p-[100px] flex flex-col justify-center items-center rounded-[20px] bg-secondary relative">
          <BiSolidCategory className="absolute top-1 left-2 text-[5vh]" />
          <h1 className="text-[10vh] font-bold ">{category.length}</h1>
          <h2 className="text-[30px]">Total Category</h2>
        </li>
        <li className="border-2 border-black p-[100px] flex flex-col justify-center items-center rounded-[20px] bg-secondary relative">
          <IoDiamondOutline className="absolute top-1 left-2 text-[5vh]" />
          <h1 className="text-[10vh] font-bold ">{auction.length}</h1>
          <h2 className="text-[30px]">Total Auction</h2>
        </li>
        <li className="border-2 border-black p-[100px] flex flex-col justify-center items-center rounded-[20px] bg-secondary relative">
          <FaBoxOpen className="absolute top-1 left-2 text-[5vh]" />
          <h1 className="text-[10vh] font-bold ">{products.length}</h1>
          <h2 className="text-[30px]">Total Products</h2>
        </li>
      </ul>
      <h1 className="text-3xl font-bold pt-10">Weekly Items Monitoring</h1>
      <div className="flex-grow border-t border-black border-[2px]"></div>
      <div className="flex justify-between items-center w-full mt-10">
        <div className="w-full ">
          <h2 className="text-xl font-bold mb-5">Order Statistics</h2>
          <Line data={salesData} options={chartOptions} />
        </div>
        <div className="w-full">
          <PieProducts productData={productData} />
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
