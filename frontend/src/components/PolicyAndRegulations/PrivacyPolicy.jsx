import React from "react";

function PrivacyPolicy({ setShowPrivacyPolicy }) {
  return (
    <div className="overflow-scroll fixed inset-0 z-[9999] grid h-full w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="sticky m-4 p-4 rounded-lg bg-white shadow-sm ">
        <div className="flex shrink-0 justify-center items-center pb-4 mx-5 text-xl font-medium text-slate-800">
          <h1 className="text-4xl my-5">Privacy Policy</h1>
        </div>
        <div className="relative border-t border-slate-300 py-4 mx-5 leading-normal text-slate-600 font-light text-lg">
          <p className="my-10">
            Welcome to the Authentique Collectibles Privacy Policy. We are
            dedicated to ensure that the privacy and security of your personal
            information are well keep and confidential. This policy outlines how
            we collect, use, and protect your data, and what steps we take to to
            keep your privacy well discrete. By using our services, you agree to
            the terms described here. Please read this policy thoroughly to
            understand our practices. This Privacy Policy applies to all users
            of Authentique Collectibles.
          </p>
          <p className="my-10">
            By accepting our Privacy Policy and the User Agreement, you
            explicitly consent to our use and disclosure of your personal
            information as described in this Privacy Policy. If you disagree
            with our practices, please do not register with us. Please be aware
            that your information will be stored and processed on our servers
            privately. Authentique Collectibles will never sell or rent your
            identifiable personal information to third parties for marketing
            purposes without your explicit consent. However, we may share
            anonymized data in a way that does not allow for personal
            identification.
          </p>
          <h1 className="font-bold my-3">Collecting Personal Information</h1>
          <p>
            We collect personal information to provide a secure and tailored
            experience. You can browse our site anonymously, but once you share
            your details, you’re no longer anonymous to us. Using our services
            may require you to provide contact and identity information but rest
            assured that all of your given information are all confidential.
          </p>
          <h1 className="font-bold my-3">Collecting Valid ID’s</h1>
          <p>
            At Authentique Collectibles, we collect valid ID information, such
            as government-issued IDs, to verify your identity, enhance security,
            and meet legal requirements. This information is gathered securely
            and protected with stringent measures. It is used solely for these
            purposes and is not sold or rented to third parties. You have the
            right to access, correct, or request the deletion of your
            information. For any questions or concerns, please contact us to the
            following social media platforms accounts.
          </p>
          <h1>Managing Your Personally Identifiable Information</h1>
          <p>
            You can update your information by logging into the Site but we do
            not modify personal details upon request due to authentication
            challenges. Changes to your password, contact details, and user
            preferences can be made in the Settings section.{" "}
          </p>
          <h1 className="font-bold my-3">Password Access and Control</h1>
          <p>
            You are responsible for all actions taken with your account and
            password. Do not share your password. If you share your credentials
            you remain accountable for any actions taken on your account. If
            your password is compromised promptly recover your account using the
            'Forgot Password' feature.
          </p>
          <h1 className="font-bold my-3">Information Disclosure Policy</h1>
          <p>
            Authentique Collectible Shop is dedicated to protecting your
            personal information and will not sell or rent your identifiable
            data to third parties for marketing purposes without your explicit
            consent. We implement industry-standard practices to ensure the
            confidentiality of your personally identifiable information. We
            treat data as a valuable asset employing various security measures
            to guard against unauthorized access and loss from both internal and
            external threats.
          </p>
        </div>
        <div className="flex justify-center items-center my-10">
          <button
            type="submit"
            className=" bg-secondary text-black py-2 w-[30%] rounded-lg font-semibold hover:bg-primary hover:text-white transition duration-200"
            onClick={() => setShowPrivacyPolicy(false)}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
