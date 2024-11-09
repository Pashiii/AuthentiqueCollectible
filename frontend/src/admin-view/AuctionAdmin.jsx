import React, { useEffect, useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { useFetchAllAuctionQuery } from "../redux/features/auction/auctionApi";
import { useNavigate } from "react-router-dom";
import LoadingTracking from "../components/LoadingTracking";

function AuctionAdmin() {
  const { data: auctions = [], isLoading, error } = useFetchAllAuctionQuery();
  const [timeLeft, setTimeLeft] = useState([]);
  const prevTimeLeftRef = useRef(timeLeft);
  const [search, setSearch] = useState("");
  const [sortCriteria, setSortCriteria] = useState("New");

  const navigate = useNavigate();

  const calculateTimeLeft = (auctionList) => {
    return auctionList.map((auction) => {
      const endTime = new Date(auction.countdown?.timeEnd).getTime();
      const currentTime = new Date().getTime();
      const difference = endTime - currentTime;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return difference > 0
        ? { days, hours, minutes, seconds }
        : { days: 0, hours: 0, minutes: 0, seconds: 0 };
    });
  };

  const filteredAuction = auctions.filter((u) => {
    const auction = `${u.title}`.toLowerCase();
    return auction.includes(search.toLowerCase());
  });

  const sortedAuction = [...filteredAuction].sort((a, b) => {
    switch (sortCriteria) {
      case "A-Z":
        return a.title.localeCompare(b.title);
      case "Z-A":
        return b.title.localeCompare(a.title);
      case "Newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "Oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  useEffect(() => {
    const updatedTimeLeft = calculateTimeLeft(sortedAuction);

    if (
      JSON.stringify(updatedTimeLeft) !==
      JSON.stringify(prevTimeLeftRef.current)
    ) {
      setTimeLeft(updatedTimeLeft);
      prevTimeLeftRef.current = updatedTimeLeft;
    }

    const intervalId = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft(sortedAuction);
      setTimeLeft(updatedTimeLeft);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [auctions, sortCriteria, filteredAuction]);

  if (isLoading)
    return (
      <div>
        <LoadingTracking />
      </div>
    );
  if (error) return <div>{error}</div>;
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">AUCTION </h1>
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
                <th className="py-2 px-4 border">Auction no.</th>
                <th className="py-2 px-4 border">Auction Item</th>
                <th className="py-2 px-4 border">Time Left</th>
                <th className="py-2 px-4 border">Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedAuction.map((auction, i) => (
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
                    {auction.title}
                  </td>
                  <td className="py-2 px-4 border">
                    {timeLeft[i]?.days}d {timeLeft[i]?.hours}h{" "}
                    {timeLeft[i]?.minutes}m {timeLeft[i]?.seconds}s
                  </td>
                  <td className="py-2 px-4 border ">
                    <div className="flex justify-center items-center">
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded-[20px] hover:bg-primary "
                        onClick={() => {
                          navigate(`/admin/auction/${auction.slug}`);
                        }}
                      >
                        View
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
            onClick={() => navigate("/admin/auction/create")}
          >
            Add Auction
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuctionAdmin;
