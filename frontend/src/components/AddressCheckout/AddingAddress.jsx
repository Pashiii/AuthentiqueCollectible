import axios from "axios";
import React, { useEffect, useState } from "react";
import EditAddress from "./EditAddress";
import AddAdress from "./AddAdress";

function AddingAddress({
  selectedAddress,
  setChangeAddrs,
  userDetails,
  handleAddressChange,
}) {
  const [choice, setChoice] = useState(
    selectedAddress ? selectedAddress._id : ""
  );
  const [singleEdit, setSingleEdit] = useState();

  const [myAddress, setMyAddress] = useState("shipping-address");

  const handleRadioChange = (address) => {
    setChoice(address);
  };

  const handleSingleEdit = (selectedUser) => {
    setSingleEdit(selectedUser);
  };

  return (
    <div>
      <div className="fixed inset-0 z-[9999] grid h-screen  w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
        <div className="sticky m-4 p-4 rounded-lg bg-white shadow-sm ">
          {myAddress === "shipping-address" && (
            <>
              <div className="flex shrink-0 items-center pb-4 mx-5 text-xl font-medium text-slate-800">
                <div className="flex justify-between w-[500px] items-center ">
                  <p> Shipping Address</p>
                  <div className="my-4">
                    {userDetails.length === 3 ? (
                      <button
                        className="text-xl border-[1px] bg-slate-50 text-slate-200 border-state-300 p-2 cursor-not-allowed"
                        disabled
                      >
                        + Add Address
                      </button>
                    ) : (
                      <button
                        className="text-xl border-[1px] border-state-300 p-2"
                        onClick={() => setMyAddress("add-address")}
                      >
                        + Add Address
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative border-t border-slate-300 py-4 mx-5 leading-normal text-slate-600 font-light">
                {userDetails.address.map((address, index) => (
                  <div
                    className="py-4 mx-5 leading-normal text-slate-600 font-light"
                    key={index}
                  >
                    {index !== 0 && (
                      <div className="border-t pb-6 border-slate-300"></div>
                    )}

                    <div className="flex items-center gap-3 ">
                      <input
                        type="radio"
                        name="addressType"
                        className="h-4 w-4 text-gray-600"
                        value={choice}
                        onChange={(e) => handleRadioChange(address._id)}
                        checked={choice === address._id}
                      />

                      <h1 className="text-lg font-semibold">{address.name}</h1>
                      <div className="border-l border-slate-300  h-5"></div>
                      <h1 className="text-lg mr-32">+{address.phone}</h1>

                      <h1
                        className="ml-auto text-blue-400 underline cursor-pointer"
                        onClick={() => {
                          handleSingleEdit(address);
                          setMyAddress("edit-address");
                        }}
                      >
                        Edit
                      </h1>
                    </div>
                    <div>
                      <p className=" ml-7 text-base">
                        {address.street} {address.barangay},<br />{" "}
                        {address.municipality}, {address.province},<br />{" "}
                        {address.region}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end border-t border-slate-200">
                <button
                  className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-red-500 bg-gray-200 hover:text-white active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => setChangeAddrs(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                  type="button"
                  onClick={() => handleAddressChange(choice)}
                >
                  Confirm
                </button>
              </div>
            </>
          )}
          {myAddress === "edit-address" && (
            <>
              <EditAddress
                setMyAddress={setMyAddress}
                singleEdit={singleEdit}
                userDetails={userDetails}
              />
            </>
          )}
          {myAddress === "add-address" && (
            <>
              <AddAdress
                setMyAddress={setMyAddress}
                userDetails={userDetails}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddingAddress;
