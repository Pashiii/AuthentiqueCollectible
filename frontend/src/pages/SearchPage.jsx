import React from "react";
import { IoMdSearch } from "react-icons/io";

function SearchPage() {
  return (
    <div className="min-h-[65vh] max-h-full">
      <div className="flex flex-col justify-center  items-center py-10 ">
        <h1 className="text-4xl p-4">Search</h1>
        <div className="flex items-center justify-center relative w-full  max-w-[70vh]">
          <input
            type="text"
            className="w-full sm:w-[70vh] p-2 border-[1px] border-black bg-transparent "
            placeholder="Search"
          />
          <IoMdSearch className="absolute right-0 text-4xl" />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
