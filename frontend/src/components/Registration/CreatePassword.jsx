import React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function CreatePassword({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordLengthError,
  setPasswordLengthError,
  passwordSymbolError,
  setPasswordSymbolError,
  passwordMatchError,
  setPasswordMatchError,
  setStep,
}) {
  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

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
    setStep("billing");
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Password</h1>
      <div className="h-[3px] bg-white mt-5"></div>
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
              Combination of uppercase letters, lowercase letters, and numbers
            </p>
          ) : (
            password && (
              <p className="text-green-400 mt-1 text-sm">
                Combination of uppercase letters, lowercase letters, and numbers
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
            <p className="text-red-400 mt-1 text-sm">Passwords do not match</p>
          ) : (
            confirmPassword && (
              <p className="text-green-400 mt-1 text-sm">Passwords match</p>
            )
          )}

          <div className="text-center pt-10 flex justify-center">
            <p className="text-sm text-gray-300 w-[600px]">
              By clicking "Sign Up," you accept our terms and policies.
            </p>
          </div>
          <div className="flex items-center justify-center py-5 mx-auto">
            <button
              type="submit"
              className="w-[450px] bg-white text-black p-2 rounded-[10px] hover:bg-gray-200"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreatePassword;
