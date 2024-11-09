import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFetchAuctionBySlugQuery } from "../../../redux/features/auction/auctionApi";
import { PiUserCircleFill } from "react-icons/pi";
import { useGetSingleUserQuery } from "../../../redux/features/auth/authApi";
import LoadingTracking from "../../../components/LoadingTracking";
import ErrorInput from "../../../components/ErrorInput";

function BidderUser() {
  const { slug } = useParams();
  const { data: auctions = [] } = useFetchAuctionBySlugQuery(slug);
  const location = useLocation();
  const bidder = location.state?.bidder;
  const ranking = location.state?.ranking;
  const userId = bidder.userId;
  const { data: user, error, isLoading } = useGetSingleUserQuery(userId);
  const userBid =
    auctions.currentBid?.filter((bid) => bid.userId === userId) || [];
  const navigate = useNavigate();
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${month}-${day}-${year}`;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{auctions.title}</h1>
        <IoIosCloseCircle
          className="text-red-400 text-[50px] cursor-pointer"
          onClick={() => navigate(`/admin/auction/${slug}`)}
        />
      </div>
      <div className="flex-grow border-t border-black border-[2px]"></div>
      <h1 className="text-3xl font-bold py-10">
        Winning Bid:{" "}
        <span className="font-normal">
          ₱
          {bidder.bid.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </h1>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className=" w-full lg:w-1/2 flex flex-col items-center  rounded-lg p-5 ">
          <PiUserCircleFill className="w-64 h-60" />
          <p className="text-2xl font-bold">
            {user.firstname.toUpperCase() + " " + user.lastname.toUpperCase()}
          </p>
          <p className="text-2xl">{user.email}</p>
          <div className="mt-4 space-y-2">
            <button className="w-full bg-secondary p-2 rounded-[20px]">
              View ID
            </button>
            <button className="w-full bg-secondary p-2 rounded-[20px]">
              Archive
            </button>
            <button className="w-full bg-red-500 text-white p-2 rounded-[20px]">
              Revoke Account
            </button>
          </div>
          <div className="bg-secondary w-full mt-10">
            <div className="flex justify-between items-center py-5 px-10 text-lg">
              <span className="font-bold">USER ID</span>
              <p className="flex w-3/5">{user._id}</p>
            </div>

            <div className="flex-grow border-t border-primary border-[1px]"></div>
            <div className="flex justify-between items-center py-5 px-10 text-lg">
              <span className="font-bold">Email</span>
              <p className="flex w-3/5">{user.email}</p>
            </div>
            <div className="flex-grow border-t border-primary border-[1px]"></div>

            <div className="flex justify-between items-center py-5 px-10 text-lg">
              <span className="font-bold">Joining Date</span>
              <p className="flex w-3/5">{formatDate(user.createdAt)}</p>
            </div>
            <div className="flex-grow border-t border-primary border-[1px]"></div>

            <div className="flex justify-between items-center py-5 px-10 text-lg">
              <span className="font-bold">First Name</span>
              <p className="flex w-3/5">
                {capitalizeFirstLetter(user.firstname)}
              </p>
            </div>
            <div className="flex-grow border-t border-primary border-[1px]"></div>

            <div className="flex justify-between items-center py-5 px-10 text-lg">
              <span className="font-bold">Last Name</span>
              <p className="flex w-3/5">
                {capitalizeFirstLetter(user.lastname)}
              </p>
            </div>
            <div className="flex-grow border-t border-primary border-[1px]"></div>

            <div className="flex justify-between items-center py-5 px-10 text-lg">
              <span className="font-bold">Birth Date</span>
              <p className="flex w-3/5">{formatDate(user.birthday)}</p>
            </div>
            <div className="flex-grow border-t border-primary border-[1px]"></div>

            <div className="flex justify-between items-center py-5 px-10 text-lg">
              <span className="font-bold">Mobile Number</span>
              <p className="flex w-3/5">{user.contact}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary w-full lg:w-1/2  p-5">
          <h1 className="text-center text-3xl font-bold">Auction Details</h1>
          <div className="flex flex-col gap-7 font-bold text-2xl mt-5">
            <h1 className="flex items-center justify-between">
              Bidding Rank :
              <span className="font-normal w-3/5">{ranking + 1}</span>
            </h1>
            <h1 className="flex items-center justify-between">
              Bidding Attemp(s) :
              <span className="font-normal w-3/5"> {userBid.length}</span>
            </h1>
            <h1 className="flex items-center justify-between">
              Highest Bid :{" "}
              <span className="font-normal w-3/5">
                {bidder.bid.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </h1>
            <h1>Bidding(s)</h1>
            {userBid.map((bid, i) => (
              <div className="ml-12 text-2xl" key={i}>
                <h1 className="font-bold">Bidding Attemp(s): {i + 1}</h1>
                <p className="ml-24 flex gap-20 mt-5 font-normal">
                  Value :
                  <span>
                    {bid.bid.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>{" "}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BidderUser;
