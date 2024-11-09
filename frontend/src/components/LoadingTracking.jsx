import React from "react";

function LoadingTracking() {
  return (
    <div className="flex items-center justify-center h-screen">
      <button
        type="button"
        className="bg-primary h-max w-max rounded-lg text-white font-bold hover:bg-secondary hover:cursor-not-allowed duration-[500ms,800ms]"
        disabled
      >
        <div className="flex items-center justify-center m-[10px]">
          <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
          <div className="ml-2">
            Processing... <div></div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default LoadingTracking;
