import React, { useState } from "react";
import RulesRegulations from "../PolicyAndRegulations/RulesRegulations";
import PrivacyPolicy from "../PolicyAndRegulations/PrivacyPolicy";

function CreationAccount({ handleSubmit }) {
  const handleCreateAccount = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  const [showRulesRegulation, setShowRulesRegulation] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  return (
    <div>
      {showRulesRegulation && (
        <RulesRegulations setShowRulesRegulation={setShowRulesRegulation} />
      )}
      {showPrivacyPolicy && (
        <PrivacyPolicy setShowPrivacyPolicy={setShowPrivacyPolicy} />
      )}
      <h1 className="text-2xl font-bold mb-5">Privacy and Consent </h1>
      <div className="h-[3px] bg-white mt-5"></div>
      <div className="my-20">
        <h1 className="text-4xl font-bold text-center">
          Dear Authentique Collectible User
        </h1>
      </div>
      <form onSubmit={handleCreateAccount}>
        <div className="flex gap-3 justify-center ">
          <input type="checkbox" required />
          <p className="mt-10 w-[75%]">
            By selecting this box, you are acknowledging that you have read and
            understood our{" "}
            <span
              className="text-blue-600 italic underline cursor-pointer"
              onClick={() => setShowPrivacyPolicy(true)}
            >
              Privacy Policy
            </span>{" "}
            and{" "}
            <span
              className="text-blue-600 italic underline cursor-pointer"
              onClick={() => setShowRulesRegulation(true)}
            >
              Rules & Regulations
            </span>{" "}
            for the collection, use, and disclosure of your information as
            described.
          </p>
        </div>
        <div className="flex items-center justify-center py-5 w-[50%] mx-auto">
          <button
            type="submit"
            className="w-full bg-white text-black p-2 rounded-lg hover:bg-gray-200"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreationAccount;
