import React from "react";

function IdReferences({ setShowIdReference }) {
  return (
    <div className="fixed inset-0 z-[9999] grid h-screen  w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="sticky m-4 p-4 rounded-lg bg-white shadow-sm ">
        <div className="flex shrink-0 justify-center items-center pb-4 mx-5 text-xl font-medium text-slate-800">
          <h1 className="text-4xl ">ID References</h1>
        </div>
        <div className="relative border-t border-slate-300 py-4 mx-5 leading-normal text-slate-600 font-light text-xl">
          <h1 className="font-bold">Valid Government Identification Cards</h1>
          <h2>- Philippine National ID (PhilSys ID)</h2>
          <h2>-Social Security System (SSS) ID</h2>
          <h2>-PhilHealth ID</h2>
          <h2>-Pag-IBIG ID</h2>
          <h2>-Driver’s License ID</h2>
          <h2>-Passport ID</h2>
          <h2>-Voter’s ID</h2>
          <h2>-Unified Multi-Purpose ID (UMID)</h2>
          <h1 className="font-bold">Others</h1>
          <h2>-Police Clearance</h2>
          <h2>-NBI Clearance</h2>
        </div>
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className=" bg-secondary text-black py-2 w-[30%] rounded-lg font-semibold hover:bg-primary hover:text-white transition duration-200"
            onClick={() => setShowIdReference(false)}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

export default IdReferences;
