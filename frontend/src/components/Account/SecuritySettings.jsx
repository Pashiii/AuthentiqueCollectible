import React, { useState } from "react";
import { FaArrowLeft, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useChangePasswordMutation } from "../../redux/features/auth/authApi";
import { Link } from "react-router-dom";

function SecuritySettings() {
  const { user } = useSelector((state) => state.auth);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState(true);
  const [passwordSymbolError, setPasswordSymbolError] = useState(true);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassowrd, setShowCurrentPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleShowCurrentPassowrd = () => {
    setShowCurrentPassword(!showCurrentPassowrd);
  };
  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);
    setPasswordMatchError(confirmPasswordValue !== password);
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    setPasswordLengthError(passwordValue.length < 8);
    setPasswordSymbolError(
      !(
        /[A-Z]/.test(passwordValue) &&
        /[a-z]/.test(passwordValue) &&
        /\d/.test(passwordValue)
      )
    );
    setPasswordMatchError(passwordValue !== confirmPassword);
  };

  const [changePassword] = useChangePasswordMutation();
  const handleSubmitChangePass = async () => {
    const data = {
      userId: user._id,
      password: currentPassword,
      newPassword: password,
    };
    try {
      const response = await changePassword(data).unwrap();
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
      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
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

  const handlePasswordMatch = (e) => {
    e.preventDefault();
    if (
      (password.length < 8 && !/[A-Z]/.test(password)) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }
    handleSubmitChangePass();
  };
  return (
    <div className="container min-h-screen">
      <div className="w-full p-5">
        <div className=" bg-[#d9d9d9] flex items-center gap-2 text-5xl p-5 font-bold">
          <Link to={"/account/settings"}>
            <FaArrowLeft />
          </Link>
          <Link to={"/account/settings"}>
            <h1>Account Security</h1>
          </Link>
        </div>
        <form onSubmit={handlePasswordMatch}>
          <div className="bg-[#d9d9d9] mt-3 pb-10 text-2xl ">
            <h1 className="text-4xl text-center font-bold p-5">
              Change Password
            </h1>
            <div className="flex items-center justify-center flex-col gap-5">
              <div className="flex flex-col relative">
                <label className="text-lg">Current password</label>
                <input
                  type={showCurrentPassowrd ? "text" : "password"}
                  placeholder="Enter your current passowrd"
                  className="bg-transparent w-[40vh] p-2 text-base rounded-lg border-black border-[1px]"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute bottom-2 right-3 cursor-pointer"
                  onClick={handleShowCurrentPassowrd}
                >
                  {showCurrentPassowrd ? (
                    <FaRegEye className="text-2xl" />
                  ) : (
                    <FaRegEyeSlash className="text-2xl" />
                  )}
                </div>
              </div>
              <div>
                <div className="flex flex-col relative">
                  <label className="text-lg">New password</label>
                  <input
                    onChange={handlePasswordChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new passowrd"
                    className="bg-transparent w-[40vh] p-2 text-base rounded-lg border-black border-[1px]"
                    required
                  />
                  <div
                    className="absolute bottom-2 right-3 cursor-pointer"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? (
                      <FaRegEye className="text-2xl" />
                    ) : (
                      <FaRegEyeSlash className="text-2xl" />
                    )}
                  </div>
                </div>
                <div className="w-[30vh]">
                  {passwordLengthError ? (
                    <p className="text-red-400 mt-1 text-sm">
                      At least 8-12 password characters
                    </p>
                  ) : (
                    password && (
                      <p className="text-green-500 mt-1 text-sm">
                        At least 8-12 password characters
                      </p>
                    )
                  )}
                  {passwordSymbolError ? (
                    <p className="text-red-400 mt-1 text-sm">
                      Combination of uppercase letters, lowercase letters, and
                      numbers
                    </p>
                  ) : (
                    password && (
                      <p className="text-green-500 mt-1 text-sm">
                        Combination of uppercase letters, lowercase letters, and
                        numbers
                      </p>
                    )
                  )}
                </div>
              </div>

              <div>
                <div className="flex flex-col relative">
                  <label className="text-lg">Confirm password</label>
                  <input
                    onChange={handleConfirmPasswordChange}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your passowrd"
                    className="bg-transparent w-[40vh] p-2 text-base rounded-lg border-black border-[1px]"
                    required
                  />
                  <div
                    className="absolute bottom-2 right-3 cursor-pointer"
                    onClick={handleShowConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <FaRegEye className="text-2xl" />
                    ) : (
                      <FaRegEyeSlash className="text-2xl" />
                    )}
                  </div>
                </div>
                {passwordMatchError ? (
                  <p className="text-red-400 mt-1 text-sm">
                    Passwords do not match
                  </p>
                ) : (
                  confirmPassword && (
                    <p className="text-green-400 mt-1 text-sm">
                      Passwords match
                    </p>
                  )
                )}
              </div>
              <button
                type="submit"
                className="border-[1px] border-black w-[25vh] h-10 rounded-[20px] text-xl font-semibold bg-[#8B8888] hover:bg-primary text-white"
              >
                Change Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SecuritySettings;
