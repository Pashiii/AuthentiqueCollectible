import React, { useEffect, useState } from "react";
import {
  useAddBidMutation,
  useFetchAuctionBySlugQuery,
} from "../redux/features/auction/auctionApi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Confirmation from "./Confirmation";
import LoadingTracking from "./LoadingTracking";
import ErrorInput from "./ErrorInput";

function AuctionProduct() {
  const [bidConfirm, setBidConfirm] = useState(false);
  const [countdowns, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { user } = useSelector((state) => state.auth);

  const params = useParams();
  const { slug } = params;
  const {
    data: auction,
    isLoading,
    error,
  } = useFetchAuctionBySlugQuery(slug, {
    pollingInterval: 500,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [currentBid, setCurrentBid] = useState(0);
  const [highestBid, setHighestBid] = useState(null);
  const minimumIncrement = 5000;
  const handleIncrease = () => {
    setCurrentBid((prevBid) => prevBid + auction.bidIncrement);
  };

  const handleDecrease = () => {
    if (currentBid - minimumIncrement >= highestBid) {
      setCurrentBid((prevBid) => prevBid - minimumIncrement);
    } else {
      setCurrentBid(highestBid);
    }
  };

  const [addBid] = useAddBidMutation();

  const handleBidConfirm = async () => {
    const auctionId = auction._id;
    const userId = user._id;
    const userName = user.email;
    const bid = currentBid;

    try {
      await addBid({ auctionId, userId, userName, bid }).unwrap();
      toast.success("Success to bid", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setBidConfirm(false);
    } catch (error) {
      console.error("Error submitting bid:", error);
      const errorMessage =
        error?.data?.message || "Incorrect Email or Password";
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
  const sortedBidders = highestBid
    ? [...auction.currentBid].sort((a, b) => b.bid - a.bid)
    : [];
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
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
    const month = monthNames[dateObj.getMonth()]; // Get month name
    const year = dateObj.getFullYear();

    return `${month} ${day}, ${year}`; // Format: Month Day, Year
  };

  useEffect(() => {
    if (highestBid !== null) {
      setCurrentBid(highestBid);
    }
  }, [highestBid]);
  useEffect(() => {
    if (
      isLoading ||
      !auction ||
      !auction.countdown ||
      !auction.countdown.timeEnd
    )
      return;

    const countdownEndTime = new Date(auction.countdown.timeEnd).getTime();

    const intervalId = setInterval(async () => {
      const timeLeft = countdownEndTime - Date.now();

      if (timeLeft < 0) {
        clearInterval(intervalId);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });

        try {
          const isOngoing = auction.countdown?.status === "ongoing";
          if (isOngoing) {
            await axios.post(`/api/auction/bid/winner/${auction._id}`);
          }
        } catch (error) {
          console.log("Error send email winner", error);
        }
      } else {
        const secondsLeft = Math.floor((timeLeft / 1000) % 60);
        const minutesLeft = Math.floor((timeLeft / (1000 * 60)) % 60);
        const hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

        setCountdown({
          days: daysLeft,
          hours: hoursLeft,
          minutes: minutesLeft,
          seconds: secondsLeft,
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [auction]);

  useEffect(() => {
    if (auction) {
      const highest = auction.currentBid?.length
        ? auction.currentBid.reduce(
            (max, bid) => (bid.bid > max ? bid.bid : max),
            auction.currentBid[0].bid
          )
        : auction.startingBid;
      setHighestBid(highest);
      setCurrentBid(highest);
    }
  }, [auction]);

  useEffect(() => {
    const fetchCurrentBid = async () => {
      try {
        const response = await axios.get(`/api/auction/${slug}`);
        const bids = response.data.currentBid;

        if (bids && bids.length > 0) {
          const highest = bids.reduce(
            (max, bid) => (bid.bid > max ? bid.bid : max),
            bids[0].bid
          );
          setHighestBid(highest);
        } else {
          setHighestBid(response.data.startingBid);
        }
      } catch (error) {
        console.error("Error fetching current bid:", error);
      }
    };

    const intervalId = setInterval(fetchCurrentBid, 300);

    return () => clearInterval(intervalId);
  }, [slug]);

  if (!isLoading && auction) {
    const isOngoing = auction.countdown?.status === "ongoing";
    if (!isOngoing) {
      return <ErrorInput />;
    }
  }
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;

  return (
    <div>
      {bidConfirm && (
        <Confirmation
          currentBid={currentBid}
          setBidConfirm={setBidConfirm}
          handleBidConfirm={handleBidConfirm}
        />
      )}
      <div className="container">
        <h1 className="text-center text-xl  md:text-[60px] font-bold py-10">
          Auction Collectible no. 01
        </h1>
        <div className="lg:grid lg:grid-cols-2 gap-2 py-5">
          <div className="p-10 h-[65vh] flex justify-end">
            <img
              src={auction.image[0].url}
              className="w-full h-full rounded-2xl border-black border-[1px] bg-center  shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] object-contain"
            />
          </div>
          <div className="h-auto">
            <h1 className="text-[40px] lg:text-[50px] font-semibold flex items-center justify-center gap-2">
              {auction.title}
            </h1>
            <div className="h-[3px] bg-black mt-5"></div>
            <p className="text-[25px] lg:text-[35px] text-center pt-5">
              Bidding Ends in:
            </p>
            <div className="w-full flash-sale">
              <ul className="flex gap-2 m-[20px] text-xs sm:text-base lg:text-lg text-black-500 justify-center">
                <li className="w-[60px] sm:w-[100px] sm:h-[80px] lg:w-[120px] h-[60px] lg:h-[100px] border-black border-2 flex justify-center items-end rounded-[10px] relative">
                  <span className="absolute top-[15px] text-red-500 text-xl sm:text-[30px] lg:text-[50px] font-bold">
                    {countdowns.days}
                  </span>
                  Days
                </li>
                <li className="w-[60px] sm:w-[100px] sm:h-[80px] lg:w-[120px] h-[60px] lg:h-[100px] border-black border-2 flex justify-center items-end rounded-[10px] relative">
                  <span className="absolute top-[15px] text-red-500 text-xl sm:text-[30px] lg:text-[50px] font-bold">
                    {countdowns.hours}
                  </span>
                  Hours
                </li>
                <li className="w-[60px] sm:w-[100px] sm:h-[80px] lg:w-[120px] h-[60px] lg:h-[100px] border-black border-2 flex justify-center items-end rounded-[10px] relative">
                  <span className="absolute top-[15px] text-red-500 text-xl sm:text-[30px] lg:text-[50px] font-bold">
                    {countdowns.minutes}
                  </span>
                  Minutes
                </li>
                <li className="w-[60px] sm:w-[100px] sm:h-[80px] lg:w-[120px] h-[60px] lg:h-[100px] border-black border-2 flex justify-center items-end rounded-[10px] relative">
                  <span className="absolute top-[15px] text-red-500 text-xl sm:text-[30px] lg:text-[50px] font-bold">
                    {countdowns.seconds}
                  </span>
                  Seconds
                </li>
              </ul>
            </div>
            <div className="h-[3px] bg-black mt-5"></div>
            <div className="flex justify-between pt-10">
              <h1 className="text-2xl font-semibold">Starting Bid:</h1>
              <h1 className="text-3xl font-semibold">
                ₱
                {auction.startingBid.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h1>
            </div>
            <div className="flex justify-between pt-10 pb-10">
              <h1 className="text-2xl font-semibold">Current Bid:</h1>
              <h1 className="text-3xl font-semibold">
                ₱
                {highestBid !== null
                  ? highestBid.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}
              </h1>
            </div>
            <div className="h-[3px] bg-black mt-5"></div>
            <div className="flex flex-col gap-5 justify-center items-center pt-5">
              <div className="border-black border-[1px] h-[40px] w-[300px] rounded-[10px] shadow-md px-2 flex items-center justify-between">
                <button
                  className=" font-bold cursor-pointer border-red-500 border-[1px] w-[30px] rounded-[7px] text-red-500"
                  onClick={handleDecrease}
                >
                  -
                </button>
                <span className="font-bold">
                  ₱
                  {currentBid.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <button
                  className="font-bold cursor-pointer border-green-500 border-[1px] w-[30px] rounded-[7px] text-green-500"
                  onClick={handleIncrease}
                >
                  +
                </button>
              </div>
              <h1>
                Minimum bid increments by ₱
                {auction.bidIncrement.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h1>
              <button
                className="border-[1px] border-black w-[150px] h-[40px] rounded-[10px]"
                onClick={() => setBidConfirm(true)}
              >
                Proceed
              </button>
            </div>
            <h1 className="text-2xl pt-10 pb-5">Product Description</h1>
            <div className="pl-10 flex flex-col gap-3 text-xl">
              <h1>{auction.description}</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-h-96 m-5">
          <div className="flex-grow overflow-auto">
            <table className="min-w-full bg-gray-200 shadow-lg rounded-lg">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="py-2 px-4 border">Ranking no.</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Bid</th>
                  <th className="py-2 px-4 border">Time</th>
                </tr>
              </thead>
              <tbody>
                {sortedBidders.map((bidder, i) => (
                  <tr key={i}>
                    <td className="py-2 px-4 border text-center ">{i + 1}</td>
                    <td>{bidder.userName}</td>
                    <td>
                      ₱
                      {bidder.bid.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>{formatDate(bidder.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionProduct;
