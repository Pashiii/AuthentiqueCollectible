import React, { useEffect } from "react";

function Confirmation({ setBidConfirm, handleBidConfirm, currentBid }) {
  console.log(currentBid);
  return (
    <div>
      <div className="fixed inset-0 z-[9999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
        <div className="relative m-4 p-4 w-2/5 min-w-[20%] max-w-[30%] rounded-lg bg-white shadow-sm">
          <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
            Confirm your bid
          </div>
          <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
            <p>
              Are you sure you want to place a bid of ₱
              {currentBid.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              ?
            </p>
            <p>
              Once submitted, you cannot cancel or reduce your bid. Make sure
              you are ready to proceed.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
            <button
              className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-red-400 bg-gray-200 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={() => setBidConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              type="button"
              onClick={handleBidConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
