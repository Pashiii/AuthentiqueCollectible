import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router-dom";
import LogoImage from "/images/logo.png";
import { useResetPassMutation } from "../redux/features/auth/authApi";
import { toast } from "react-toastify";

function ResetPassword() {
  const { id, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState(true);
  const [passwordSymbolError, setPasswordSymbolError] = useState(true);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

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

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);
    setPasswordMatchError(confirmPasswordValue !== password);
  };

  const [resetPassword] = useResetPassMutation();
  const handleResetPassword = async () => {
    const data = {
      userId: id,
      token: token,
      password: password,
    };
    console.log(data);
    try {
      const response = await resetPassword(data).unwrap();
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
      navigate("/signin");
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
    handleResetPassword();
  };
  return (
    <div className="grid grid-cols-2 m-auto p-[100px] h-auto">
      <div className="bg-secondary flex flex-col items-center justify-center">
        <img src={LogoImage} alt="" className="w-[200px]" />
        <div className="text-center xl:text-left">
          <h1 className="text-4xl font-bold pt-5">AUTHENTIQUE COLLECTIBLES</h1>
          <p className="text-lg">TOYS • BAGS SNEAKERS • & MORE</p>
        </div>
      </div>
      <div className="bg-primary">
        <div className="m-auto px-10 py-10 text-white">
          <h1 className="text-2xl font-bold">New Password</h1>
          <div className="h-[3px] bg-white mt-5"></div>
          <h1 className="text-2xl font-bold py-5">
            Please enter your new password
          </h1>
          <div className="mt-5 mb-5">
            <form onSubmit={handlePasswordMatch}>
              <label className="block text-lg">Password:</label>
              <div className="relative w-full">
                <input
                  onChange={handlePasswordChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="bg-transparent w-full p-2 rounded-lg border-white border-[1px]"
                  required
                />
                <div
                  className="absolute right-3 top-2 cursor-pointer"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <FaRegEye className="text-2xl" />
                  ) : (
                    <FaRegEyeSlash className="text-2xl" />
                  )}
                </div>
              </div>
              {passwordLengthError ? (
                <p className="text-red-400 mt-1 text-sm">
                  At least 8-12 password characters
                </p>
              ) : (
                password && (
                  <p className="text-green-400 mt-1 text-sm">
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
                  <p className="text-green-400 mt-1 text-sm">
                    Combination of uppercase letters, lowercase letters, and
                    numbers
                  </p>
                )
              )}

              <label className="block text-lg">Confirm Password:</label>
              <div className="relative w-full">
                <input
                  onChange={handleConfirmPasswordChange}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="bg-transparent w-full p-2 rounded-lg border-white border-[1px]"
                  required
                />
                <div
                  className="absolute right-3 top-2 cursor-pointer"
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
                  <p className="text-green-400 mt-1 text-sm">Passwords match</p>
                )
              )}

              <div className="flex items-center justify-center py-12 mx-auto">
                <button
                  type="submit"
                  className="w-[450px] bg-white text-black p-2 rounded-[10px] hover:bg-gray-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
