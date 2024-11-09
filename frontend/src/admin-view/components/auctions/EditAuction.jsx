import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { LuTrash } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchAuctionBySlugQuery,
  useUpdateAuctionMutation,
} from "../../../redux/features/auction/auctionApi";
import LoadingTracking from "../../../components/LoadingTracking";
import ErrorInput from "../../../components/ErrorInput";
import { toast } from "react-toastify";

function EditAuction() {
  const { slug } = useParams();
  const {
    data: auctions = [],
    error,
    isLoading,
  } = useFetchAuctionBySlugQuery(slug);
  const [auctionName, setAuctionName] = useState("");
  const [itemSpec, setItemSpec] = useState("");
  const [itemDetails, setItemDetails] = useState("");
  const [images, setImages] = useState([]);
  const [startBid, setStartBid] = useState("");
  const [bidIncrement, setBidIncremenet] = useState(0);
  const [bidLimit, setBidLimit] = useState(0);
  const [timeStart, setTimeStart] = useState({ day: "", month: "", year: "" });
  const [timeEnd, setTimeEnd] = useState({ day: "", month: "", year: "" });

  const navigate = useNavigate();
  useEffect(() => {
    if (auctions.title && auctions.category) {
      setAuctionName(auctions.title);
      setItemSpec(auctions.category);
      setItemDetails(auctions.description);
      setImages(auctions.image.map((i) => i.url));
      setStartBid(auctions.startingBid);
      setBidIncremenet(auctions.bidIncrement);
      setBidLimit(auctions.bidLimit);

      const endDate = new Date(auctions.countdown.timeEnd);
      const startDate = new Date(auctions.countdown.timeStart);

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

      setTimeStart({
        day: startDate.getDate(),
        month: months[startDate.getMonth()],

        year: startDate.getFullYear(),
      });
    }
  }, [auctions]);
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

  const currentYear = new Date().getFullYear();
  const pastYears = Array.from({ length: 80 }, (_, i) => currentYear - (i + 1));
  const futureYears = Array.from({ length: 11 }, (_, i) => currentYear + i);

  const years = [...pastYears.reverse(), ...futureYears];

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

  const formatDay = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    return `${day}`;
  };
  const formatYear = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    return `${year}`;
  };
  const formatMonth = (date) => {
    const dateObj = new Date(date);
    const monthNames = [
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
    const month = monthNames[dateObj.getMonth()];

    return `${month}`;
  };

  const [updateAuction] = useUpdateAuctionMutation();
  const handleAddAuction = async (e) => {
    e.preventDefault();

    const formatTimeEnd = (timeEnd) => {
      const { day, month, year } = timeEnd;
      return `${day}-${month}-${year}`;
    };
    const editAuction = {
      title: auctionName,
      item: "Collectible",
      startingBid: startBid,
      bidIncrement: bidIncrement,
      bidLimit: bidLimit,
      description: itemDetails,
      category: itemSpec,
      imageURL: images,
      countdown: {
        status: "ongoing",
        timeEnd: formatTimeEnd(timeEnd),
        timeStart: formatTimeEnd(timeStart),
      },
    };
    try {
      const response = await updateAuction({
        editAuction,
        auctionId: auctions._id,
      }).unwrap();
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
      console.log("Success Update", editAuction);
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
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AUCTION </h1>
        <IoIosCloseCircle
          className="text-red-400 text-[50px] cursor-pointer"
          onClick={() => navigate(`/admin/auction/${slug}`)}
        />
      </div>
      <div className="flex-grow border-t border-black border-[2px]"></div>
      <div>
        <form onSubmit={handleAddAuction}>
          <h1 className="text-center font-bold text-3xl py-5">
            Auction Details
          </h1>
          <div className="mt-10 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">Auction Name</label>
            <input
              type="text"
              className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[50vh]"
              value={auctionName}
              onChange={(e) => setAuctionName(e.target.value)}
              required
            />
          </div>
          <div className="mt-10 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">
              Item Specification
            </label>
            <input
              type="text"
              className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[50vh]"
              value={itemSpec}
              onChange={(e) => setItemSpec(e.target.value)}
              required
            />
          </div>
          <div className="mt-10 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">
              Product Details
            </label>
            <textarea
              type="text"
              className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[50vh]"
              value={itemDetails}
              onChange={(e) => setItemDetails(e.target.value)}
              required
            />
          </div>
          <div className="mt-5 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">
              Product Pictures
            </label>
            <div className="flex flex-col ">
              <label className="text-lg font-semibold ml-10">
                Select first for main picture
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
                key={i}
                className="border border-gray-400 rounded m-2 relative"
              >
                <img
                  src={image}
                  alt={`Preview ${i}`}
                  className=" object-cover w-[50vh]"
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
          <div className="mt-10 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">Starting Bid</label>
            <input
              type="number"
              className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[50vh]"
              value={startBid}
              onChange={(e) => setStartBid(e.target.value)}
              required
            />
          </div>
          <div className="mt-10 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">
              Bidding Increment
            </label>
            <input
              type="number"
              className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[50vh]"
              value={bidIncrement}
              onChange={(e) => setBidIncremenet(e.target.value)}
              required
            />
          </div>
          <div className="mt-10 flex items-center">
            <label className="text-3xl font-bold w-[30vh]">Bidding Limit</label>
            <input
              type="number"
              className="ml-10 border border-black bg-secondary  rounded-[10px] p-2 w-[50vh]"
              value={bidLimit}
              onChange={(e) => setBidLimit(e.target.value)}
              required
            />
          </div>
          <div className="mt-16 flex items-center">
            <label className="text-3xl font-bold w-[35vh]">
              Start of bidding
            </label>
            <div className="flex items-center gap-2 ">
              <select
                className="border border-black bg-secondary rounded-[10px] px-5  py-2 w-[20vh]"
                value={timeStart.month}
                onChange={(e) =>
                  setTimeStart((prev) => ({ ...prev, month: e.target.value }))
                }
              >
                <option value="" disabled>
                  {formatMonth(auctions.countdown.timeStart)}
                </option>
                {months.map((m) => (
                  <option key={m} value={m} className="text-black">
                    {m}
                  </option>
                ))}
              </select>
              <select
                className=" border border-black bg-secondary  rounded-[10px] px-5 w-[20vh] py-2"
                value={timeStart.day}
                onChange={(e) =>
                  setTimeStart((prev) => ({ ...prev, day: e.target.value }))
                }
              >
                <option value="" disabled>
                  {formatDay(auctions.countdown.timeStart)}
                </option>
                {days.map((d) => (
                  <option key={d} value={d} className="text-black">
                    {d}
                  </option>
                ))}
              </select>
              <select
                className="border border-black bg-secondary  rounded-[10px] px-5 w-[20vh] py-2"
                value={timeStart.year}
                onChange={(e) =>
                  setTimeStart((prev) => ({ ...prev, year: e.target.value }))
                }
              >
                <option value="" disabled>
                  {formatYear(auctions.countdown.timeStart)}
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
              End of bidding
            </label>
            <div className="flex items-center gap-2 ">
              <select
                className="border border-black bg-secondary  rounded-[10px] px-5  py-2 w-[20vh]"
                value={timeEnd.month}
                onChange={(e) =>
                  setTimeEnd((prev) => ({ ...prev, month: e.target.value }))
                }
              >
                <option value="" disabled>
                  {formatMonth(auctions.countdown.timeEnd)}
                </option>
                {months.map((m) => (
                  <option key={m} value={m} className="text-black">
                    {m}
                  </option>
                ))}
              </select>
              <select
                className=" border border-black bg-secondary  rounded-[10px] px-5 w-[20vh] py-2"
                value={timeEnd.day}
                onChange={(e) =>
                  setTimeEnd((prev) => ({ ...prev, day: e.target.value }))
                }
              >
                <option value="" disabled>
                  {formatDay(auctions.countdown.timeEnd)}
                </option>
                {days.map((d) => (
                  <option key={d} value={d} className="text-black">
                    {d}
                  </option>
                ))}
              </select>
              <select
                className="border border-black bg-secondary  rounded-[10px] px-5 w-[20vh] py-2"
                value={timeEnd.year}
                onChange={(e) =>
                  setTimeEnd((prev) => ({ ...prev, year: e.target.value }))
                }
              >
                <option value="" disabled>
                  {formatYear(auctions.countdown.timeEnd)}
                </option>
                {years.map((y) => (
                  <option key={y} value={y} className="text-black">
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 items-center m-10">
            <button
              type="submit"
              className="bg-green-400 px-5 py-2 text-white font-bold text-2xl rounded-[20px]"
            >
              Update Auction
            </button>
            <button
              className="bg-primary px-[5vh] py-2 text-white font-bold text-2xl rounded-[20px]"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/admin/auction/${slug}`);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAuction;
