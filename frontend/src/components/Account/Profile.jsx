import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useEditProfileMutation,
  useGetSingleUserQuery,
} from "../../redux/features/auth/authApi";
import LoadingTracking from "../LoadingTracking";
import ErrorInput from "../ErrorInput";
import { toast } from "react-toastify";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const {
    data: userDetails = [],
    isLoading,
    error,
  } = useGetSingleUserQuery(user._id);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [number, setNumber] = useState("");

  const [birthday, setBirthday] = useState("");
  useEffect(() => {
    if (userDetails.firstname && userDetails.lastname) {
      setFirstName(userDetails.firstname);
      setLastName(userDetails.lastname);
      setNumber(userDetails.contact);
      setBirthday(formatDate(userDetails.birthday));
    }
  }, [userDetails]);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${month}-${day}-${year}`;
  };

  const [updateUserProfile] = useEditProfileMutation();
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const data = {
      userId: userDetails._id,
      contact: number,
      firstname: firstName,
      lastname: lastName,
      birthday: birthday,
    };
    try {
      const response = await updateUserProfile(data).unwrap();
      toast.success(response.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to update";
      console.log(errorMessage);
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;

  return (
    <div>
      <div className="container min-h-screen">
        <form onSubmit={handleUpdateProfile}>
          <div className="w-full p-5">
            <div className=" bg-[#d9d9d9] flex items-center gap-2 text-5xl p-5 font-bold">
              <Link to={"/account/settings"}>
                <FaArrowLeft />
              </Link>
              <Link to={"/account/settings"}>
                <h1>Account Information</h1>
              </Link>
            </div>

            <div className="bg-[#d9d9d9] mt-3 pb-10 text-2xl ">
              <div className="flex items-center justify-between p-5">
                <h1>First Name</h1>
                <input
                  type="text"
                  value={firstName}
                  className="h-10 border-[1px] border-black rounded-[20px] bg-transparent px-5"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex-grow border-t border-black border-[1px]"></div>
              <div className="flex items-center justify-between p-5">
                <h1>Last Name</h1>
                <input
                  type="text"
                  value={lastName}
                  className="h-10 border-[1px] border-black rounded-[20px] bg-transparent px-5"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="flex-grow border-t border-black border-[1px]"></div>

              <div className="flex items-center justify-between p-5">
                <h1>Email</h1>
                <h1>{userDetails.email}</h1>
              </div>
              <div className="flex-grow border-t border-black border-[1px]"></div>
              <div className="flex items-center justify-between p-5">
                <h1>Mobile Number</h1>
                <input
                  type="text"
                  value={number}
                  className="h-10 border-[1px] border-black rounded-[20px] bg-transparent px-5"
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
              <div className="flex-grow border-t border-black border-[1px]"></div>

              <div className="flex items-center justify-between p-5">
                <h1>Birthday</h1>
                <input
                  type="text"
                  value={birthday}
                  className="h-10 border-[1px] border-black rounded-[20px] bg-transparent px-5"
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
              <div className="flex-grow border-t border-black border-[1px]"></div>
              <div className="flex items-center justify-between p-5">
                <h1>Verification ID</h1>
                <button className="w-[30vh] h-10 rounded-[20px] border-[1px] border-black">
                  Add ID
                </button>
              </div>
              <div className="flex-grow border-t border-black border-[1px]"></div>
            </div>
            <div className="flex justify-end m-5">
              <button
                type="submit"
                className="border-[1px] border-black w-[22vh] h-12 rounded-[10px] text-2xl font-semibold bg-[#8B8888] hover:bg-primary text-white"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
