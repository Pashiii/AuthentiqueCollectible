import React, { useState } from "react";
import LogoImage from "/images/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../../redux/features/auth/authApi";
import { MdError } from "react-icons/md";
import { setUser } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

function Login() {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");

  const redirect = redirectInUrl ? redirectInUrl : "/";
  console.log(redirect);
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    try {
      const response = await loginUser(data).unwrap();
      const { token, user } = response;
      dispatch(setUser({ user }));
      toast.success("Login Success", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      if (user.role !== "admin") {
        navigate(`${redirect}`);
      } else {
        navigate("/admin");
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || "Incorrect Email or Password";
      setMessage(errorMessage);
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

  return (
    <div className="min-h-screen max-h-full">
      <div className="grid lg:grid-cols-2 m-auto py-10 sm:p-10 lg:p-[100px] ">
        <div className="bg-secondary flex flex-col items-center justify-center">
          <img src={LogoImage} alt="" className="w-[200px]" />
          <div className="text-center xl:text-left">
            <h1 className="text-2xl lg:text-4xl font-bold pt-5">
              AUTHENTIQUE COLLECTIBLES
            </h1>
            <p className="lg:text-lg">TOYS • BAGS SNEAKERS • & MORE</p>
          </div>
        </div>
        <div className="bg-primary">
          <div className="m-auto px-10 py-10 text-white">
            <h1 className="text-xl lg:text-2xl font-bold ">Sign In</h1>
            <div className="h-[3px] bg-white mt-5"></div>
            <form
              onSubmit={handleLogin}
              className="mt-10 mb-5 flex flex-col gap-3"
            >
              {message && (
                <p className="text-red-400 flex items-center gap-2 text-base">
                  <MdError />
                  {message}
                </p>
              )}
              <div>
                <label className="block lg:text-lg">Email:</label>
                <input
                  type="text"
                  id="email"
                  placeholder="Enter your email"
                  className="bg-transparent border-white border-[1px] outline-none rounded-[10px] w-full p-2"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block lg:text-lg">Password:</label>
                <div className="relative ">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    className="bg-transparent w-full p-2 rounded-lg border-white border-[1px]"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-3 top-2 cursor-pointer"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? (
                      <div className="text-2xl">
                        <FaRegEye />
                      </div>
                    ) : (
                      <div className="text-2xl">
                        <FaRegEyeSlash />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Link to="/forget-password">
                <p className="font-normal italic underline text-sm cursor-pointer">
                  Forgot Password?
                </p>
              </Link>
              <div className="flex items-center justify-center py-5">
                <button className="bg-white text-black w-full lg:w-[450px] h-10 rounded-[10px]">
                  Login
                </button>
              </div>
            </form>

            <div className="flex items-center mb-2">
              <div className="flex-grow border-t border-white border-[1px]"></div>
              <span className="mx-2 text-base whitespace-nowrap">
                New to Authentique Collectibles?
              </span>
              <div className="flex-grow border-t border-white border-[1px]"></div>
            </div>
            <Link to={`/signup?redirect=${redirect}`}>
              <div className="flex items-center justify-center py-5 ">
                <button className="bg-white text-black w-full lg:w-[450px] h-10 rounded-[10px]">
                  Create an Account
                </button>
              </div>
            </Link>

            {/* <div className="mt-10 mb-5">
              <h1 className="text-xl pb-2">Email:</h1>
              <input
                type="text"
                placeholder="Enter your email"
                className="bg-transparent border-white border-[1px] outline-none rounded-[10px] w-full p-2"
              />
            </div>
            <div>
              <h1 className="text-xl pb-2">Password:</h1>
              <div className="relative border-white border-[1px] outline-none rounded-[10px] w-full p-2 mb-3 ">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className="bg-transparent outline-none w-full "
                />
                {showPassword ? (
                  <div className="absolute flex right-3 top-2 text-2xl">
                    <button onClick={handleHidePassword}>
                      <FaRegEye />
                    </button>
                  </div>
                ) : (
                  <div className="absolute flex right-3 top-2 text-2xl">
                    <button onClick={handleShowPassword}>
                      <FaRegEyeSlash />
                    </button>
                  </div>
                )}
              </div>
              <p className="font-normal italic underline text-sm">
                Forgot Password?
              </p>
            </div>
            <div className="flex items-center justify-center py-5">
              <button className="bg-white text-black w-[450px] h-10 rounded-[10px]">
                Login
              </button>
            </div>
            <div className="flex items-center mb-2">
              <div className="flex-grow border-t border-white border-[1px]"></div>
              <span className="mx-2 text-base whitespace-nowrap">
                New to Authentique Collectibles?
              </span>
              <div className="flex-grow border-t border-white border-[1px]"></div>
            </div>
            <Link to="/register">
              <div className="flex items-center justify-center py-5  mx-auto ">
                <button className="bg-white text-black  w-[450px] h-10 rounded-[10px]">
                  Create an Account
                </button>
              </div>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
