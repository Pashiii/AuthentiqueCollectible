import React, { useEffect, useState } from "react";
import {
  useChangeStatusAuctionMutation,
  useFetchAuctionBySlugQuery,
} from "../../../redux/features/auction/auctionApi";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosCloseCircle } from "react-icons/io";
import LoadingTracking from "../../../components/LoadingTracking";
import ErrorInput from "../../../components/ErrorInput";
import { toast } from "react-toastify";

function AuctionDetails() {
  const params = useParams();
  const { title } = params;
  const navigate = useNavigate();
  const {
    data: auctions = [],
    error,
    isLoading,
  } = useFetchAuctionBySlugQuery(title);

  const [changeStatus] = useChangeStatusAuctionMutation();

  const handleChangeStatusAuction = async (auctionDetails) => {
    const data = {
      auctionId: auctionDetails._id,
      status: auctionDetails.status,
    };
    console.log(data);
    try {
      const response = await changeStatus(data).unwrap();
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

  const [highestBids, setHighestBids] = useState([]);

  useEffect(() => {
    if (auctions.currentBid && auctions.currentBid.length > 0) {
      const uniqueBids = getHighestBidsPerBidder(auctions.currentBid);
      const sortedBids = uniqueBids.sort((a, b) => b.bid - a.bid);
      setHighestBids(sortedBids);
    }
  }, [auctions]);

  const getHighestBidsPerBidder = (bids) => {
    const bidMap = new Map();

    bids.forEach((bid) => {
      if (!bidMap.has(bid.userId) || bidMap.get(bid.userId).bid < bid.bid) {
        bidMap.set(bid.userId, bid);
      }
    });

    return Array.from(bidMap.values());
  };

  const handleBidder = ({ bidder, ranking }) => {
    navigate(`/admin/auction/${title}/${bidder.userId}`, {
      state: { bidder, ranking },
    });
  };

  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{auctions.title}</h1>
        <IoIosCloseCircle
          className="text-red-400 text-[50px] cursor-pointer"
          onClick={() => navigate("/admin/auction")}
        />
      </div>
      <div className="flex-grow border-t border-black border-[2px]"></div>
      <div className="flex justify-between pt-10">
        <div>
          <h1 className="font-semibold text-2xl pb-5">
            Starting Bid: ₱
            <span>
              {auctions.startingBid.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </h1>
          <h1 className="font-semibold text-2xl">Bidding</h1>
        </div>
        <div className="flex justify-center items-center gap-3">
          <button
            className="bg-green-500 p-2 px-5 rounded-[20px] text-white"
            onClick={() => navigate(`/admin/auction/edit/${auctions.slug}`)}
          >
            Edit Auction
          </button>
          {auctions.countdown.status === "ongoing" ? (
            <button
              className="bg-red-400 p-2 px-5 rounded-[20px] text-white"
              onClick={() =>
                handleChangeStatusAuction({
                  _id: auctions._id,
                  status: "stopped",
                })
              }
            >
              Stop Auction
            </button>
          ) : (
            <button
              className="bg-red-400 p-2 px-5 rounded-[20px] text-white"
              onClick={() =>
                handleChangeStatusAuction({
                  _id: auctions._id,
                  status: "ongoing",
                })
              }
            >
              Continue Auction
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center pt-3">
        <table className="min-w-full bg-gray-200 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-primary text-white">
              <th className="py-2 px-4 border">Ranking no.</th>
              <th className="py-2 px-4 border">Username</th>
              <th className="py-2 px-4 border">Bid</th>
              <th className="py-2 px-4 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {highestBids.map((bidder, ranking) => (
              <tr
                key={ranking}
                className={`${
                  ranking % 2 === 0 ? "bg-gray-100" : "bg-white"
                } border-b`}
              >
                <td className="py-2 px-4 border text-center font-bold text-xl">
                  {ranking + 1}
                </td>
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  {bidder.userName}
                </td>
                <td className="py-2 px-4 border text-center text-xl">
                  ₱
                  {bidder.bid.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 px-4 border flex justify-center">
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-[20px] hover:bg-primary"
                    onClick={() => handleBidder({ bidder, ranking })}
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

export default AuctionDetails;
