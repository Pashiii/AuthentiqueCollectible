import React, { useEffect, useState } from "react";
import { useFetchAllAuctionQuery } from "../redux/features/auction/auctionApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingTracking from "../components/LoadingTracking";
import ErrorInput from "../components/ErrorInput";
import BiddingTermsNCondition from "../components/ClientAlert/BiddingTermsNCondition";

function Auction() {
  const {
    data: auction = [],
    isLoading,
    error,
  } = useFetchAllAuctionQuery(
    {},
    {
      pollingInterval: 1000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [termsPopup, setTermsPopup] = useState(false);
  const ongoingAuction = auction.filter(
    (e) => e.countdown.status === "ongoing"
  );
  useEffect(() => {
    const popup = sessionStorage.getItem("AuctionPopup");
    if (popup === null) {
      setTermsPopup(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });
  console.log(auction);
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div className="container">
      {termsPopup && <BiddingTermsNCondition setTermsPopup={setTermsPopup} />}
      <div
        className="overflow-hidden  max-w-[2000px] h-[330px] sm:h-[380px] lg:h-[570px] xl:h-[700px] 2xl:h-[780px] w-full m-auto py-16 px-4 relative group"
        data-aos="fade-up"
        data-aos-delay="150"
      >
        <div
          style={{ backgroundImage: `url(images/auction_banner.png)` }}
          className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
        ></div>
      </div>
      <div data-aos="fade-up" data-aos-delay="150">
        <h1 className="md:text-[35px] font-bold">FEATURED AUCTION</h1>
        {ongoingAuction.map((items, index) => (
          <div className="mb-10 md:h-screen relative group" key={index}>
            <div
              style={{ backgroundImage: `url(images/wallpaper.png)` }}
              className="h-[30vh] md:h-full md:w-full  rounded-2xl bg-center bg-cover duration-500 grid grid-cols-2"
            >
              <div className="flex justify-center items-center ">
                <img
                  src={items.image[0].url}
                  className="w-[12vh]  sm:w-[16vh] md:w-[25vh] lg:w-[40vh] rounded-[10px] border-2 border-white"
                  alt=""
                />
              </div>
              <div className="text-white text-center h-full flex flex-col justify-center items-center">
                <h1 className="md:text-[60px] font-thin italic">
                  {items.category}
                </h1>
                <h1 className="md:text-[70px] lg:text-[100px]">
                  {items.title}
                </h1>

                {user ? (
                  <>
                    <button
                      className="border-white border-[2px] py-1 px-2 md:py-3 md:px-[50px] md:text-2xl font-semibold rounded-[10px]"
                      onClick={() => navigate(`/auction/${items.slug}`)}
                    >
                      Explore
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="border-white border-[2px] md:py-3 md:px-[50px] md:text-2xl font-semibold rounded-[10px]"
                      onClick={() => navigate("/signin?redirect=/auction")}
                    >
                      Explore
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Auction;
