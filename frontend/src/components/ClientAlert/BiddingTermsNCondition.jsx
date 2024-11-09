import React from "react";
import { MdClose } from "react-icons/md";

function BiddingTermsNCondition({ setTermsPopup }) {
  const handleClosePopup = () => {
    setTermsPopup(false);
    sessionStorage.setItem("AuctionPopup", true);
  };
  return (
    <div className="overflow-scroll fixed inset-0 z-[9999] grid h-full w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="sticky m-4 p-4 rounded-lg bg-primary shadow-sm w-1/2">
        <MdClose
          className="absolute right-5 bg-red-500 text-3xl p-1 rounded-full text-white"
          onClick={handleClosePopup}
        />
        <div className="flex flex-col shrink-0 justify-center items-center pb-4 mx-5 text-xl font-medium text-slate-800">
          <img src="/images/logo.png" alt="" className="w-[100px]" />
          <h1 className="text-4xl my-5 font-bold text-white">
            Terms and Conditions
          </h1>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-300 py-4 mx-5 leading-normal text-white font-light text-lg">
          <h1 className="text-center font-bold my-3">
            REMINDER: READ FIRST !{" "}
            <span className="font-normal">
              Participants must agree to the terms and conditions before placing
              a bid.
            </span>
          </h1>
          <p>
            1.) Bidders must read the detailed information of the auctioned item
            before placing a bid.
          </p>
          <p>
            2.) During registration all participants must be registered on the
            website to participate in auctions.
          </p>
          <p>
            3.) Bidder must provide a valid identification card information
            during registration process.
          </p>
          <p>
            4.) Ensure all bidder information is confidentially stored and used
            in accordance with privacy laws and regulations.
          </p>
          <p>
            5.) Each participant submits their bid without knowing the bids of
            others.
          </p>
          <p>6.) All bids are final and cannot be retracted once placed.</p>
          <p>7.) Each auction will have a specified start and end time.</p>
          <p>
            8.) No bids will be considered after the auction ends. The auction
            will close once the time expires.
          </p>
          <p>
            9.) The highest bid at the end of the auction period will win the
            auction item.
          </p>
          <p>
            10.) Winners will be notified via email and through their account on
            the website.
          </p>
          <p>
            11.) Winners must complete the full payment within a specified
            timeframe (e.g., 48 hours) after the auction ends.
          </p>
          <p>
            12.) Strictly payment first before we ship the auctioned item to the
            winner.
          </p>
          <p>
            13.) If the winning bidder fails to pay within the given timeframe,
            the item will be relisted for auction again.
          </p>
          <p>
            14.) If the winning bidder fails to submit their legal requirements
            (Valid card identity), the item will be relisted for auction again.{" "}
          </p>
          <p>
            15.) Non-payment and cancellation after bidding process could result
            in suspension or banning of the bidder’s account.
          </p>
        </div>
        <div className="flex justify-center items-center my-10">
          <button
            type="submit"
            className=" bg-secondary text-black py-2 w-[30%] rounded-lg font-semibold hover:bg-green-700 hover:text-white transition duration-200"
            onClick={handleClosePopup}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

export default BiddingTermsNCondition;
