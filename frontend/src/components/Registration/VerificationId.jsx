import React, { useState } from "react";
import IdReferences from "../PolicyAndRegulations/IdReferences";

function VerificationId({ setValidId, setStep, validId }) {
  const [showIdReference, setShowIdReference] = useState(false);
  const handleNextConfirmation = (e) => {
    e.preventDefault();
    setStep("confirmation");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
    console.log(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setValidId((prevImages) => [...prevImages, reader.result]);
    };
  };
  return (
    <div>
      {showIdReference && (
        <IdReferences setShowIdReference={setShowIdReference} />
      )}

      <h1 className="text-2xl font-bold mb-5">Verification ID</h1>
      <div className="h-[3px] bg-white mt-5"></div>
      <p className="italic mb-5">Please upload a clear picture of your ID </p>
      <div>
        <form onSubmit={handleNextConfirmation}>
          <h1 className=" font-semibold">Add New Identification Card</h1>
          <p>
            To proceed with creating your account, please provide a valid
            identification card. This requirement is essential for verifying
            your identity and ensuring the security of your account. Thank you
            for your cooperation.
          </p>
          <div className="flex justify-center items-center m-10">
            <div className="w-[75%] ">
              <input
                type="file"
                accept="image/*"
                className="bg-transparent border-white border-[1px] w-full p-2 rounded-lg "
                required
                onChange={handleImageChange}
              />
              <p className="italic text-red-500">
                Please upload clear and landscape photo{" "}
              </p>
              <p className="italic">
                *National ID,Philhealth ID,Pag-IBIG ID, Driver’s License and
                other government ID only{" "}
                <span
                  className="underline text-blue-700 cursor-pointer"
                  onClick={() => setShowIdReference(true)}
                >
                  click here
                </span>{" "}
                for ID references
              </p>
            </div>
          </div>
          {validId.map((image, i) => (
            <div className="flex flex-col justify-center items-center">
              <img
                src={image}
                alt={`Preview ${i}`}
                className=" object-cover w-[50%] mt-2"
              />
            </div>
          ))}
          <div className="flex items-center justify-center py-5 w-[50%] mx-auto">
            <button
              type="submit"
              className="w-full bg-white text-black p-2 rounded-lg hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerificationId;
