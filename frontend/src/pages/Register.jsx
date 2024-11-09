import React, { useState } from "react";
import LogoImage from "/images/logo.png";
import {
  useGetUserQuery,
  useRegisterUserMutation,
} from "../redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import CreatePassword from "../components/Registration/CreatePassword";
import CreateDetails from "../components/Registration/CreateDetails";
import BillingDetails from "../components/Registration/BillingDetails";
import VerificationId from "../components/Registration/VerificationId";
import CreationAccount from "../components/Registration/CreationAccount";
import { toast } from "react-toastify";

const Register = () => {
  const [step, setStep] = useState("details");

  const { data: user } = useGetUserQuery();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleNext = () => {
    const existingUser = user.find((u) => u.email === email);
    if (existingUser) {
      return setMessage("Email already exists");
    }

    setStep("password");
  };

  const handleSubmit = async () => {
    const data = {
      email,
      password,
      firstname,
      lastname,
      birthday: `${day}-${month}-${year}`,
      address: {
        name: firstname + " " + lastname,
        phone: phoneNumber,
        region: selectedRegion,
        province: selectedProvince,
        municipality: selectedCity,
        barangay: selectedBarangay,
        street: street,
        isDefault: true,
      },
      contact: phoneNumber,
      verificationID: validId,
    };
    try {
      const response = await registerUser(data).unwrap();
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
      console.log(data);
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to create account";
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
      setMessage("");
    }
  };
  const [message, setMessage] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  //password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState(true);
  const [passwordSymbolError, setPasswordSymbolError] = useState(true);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //billing

  const [street, setStreet] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");

  //verification id
  const [validId, setValidId] = useState([]);
  return (
    <div className="min-h-screen max-h-full">
      <div className="grid lg:grid-cols-2 m-auto py-10 sm:p-10 lg:p-[100px] ">
        <div className="bg-secondary flex flex-col items-center justify-center">
          <img src={LogoImage} alt="" className="w-[200px]" />
          <div className="text-center xl:text-left">
            <h1 className="text-4xl font-bold pt-5">
              AUTHENTIQUE COLLECTIBLES
            </h1>
            <p className="text-lg">TOYS • BAGS SNEAKERS • & MORE</p>
          </div>
        </div>
        <div className="bg-primary">
          <div className="m-auto px-10 py-10 text-white">
            {/* Step 1: User Details Form */}
            {step === "details" && (
              <CreateDetails
                firstname={firstname}
                setFirstname={setFirstname}
                lastname={lastname}
                setLastname={setLastname}
                day={day}
                setDay={setDay}
                month={month}
                setMonth={setMonth}
                year={year}
                setYear={setYear}
                email={email}
                setEmail={setEmail}
                handleNext={handleNext}
                message={message}
              />
            )}

            {/* Step 2: Password Form */}
            {step === "password" && (
              <CreatePassword
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                passwordLengthError={passwordLengthError}
                setPasswordLengthError={setPasswordLengthError}
                passwordSymbolError={passwordSymbolError}
                setPasswordSymbolError={setPasswordSymbolError}
                passwordMatchError={passwordMatchError}
                setPasswordMatchError={setPasswordMatchError}
                setStep={setStep}
              />
            )}
            {step === "billing" && (
              <BillingDetails
                setSelectedBarangay={setSelectedBarangay}
                selectedBarangay={selectedBarangay}
                setSelectedCity={setSelectedCity}
                selectedCity={selectedCity}
                setSelectedProvince={setSelectedProvince}
                selectedProvince={selectedProvince}
                setSelectedRegion={setSelectedRegion}
                selectedRegion={selectedRegion}
                setStreet={setStreet}
                setPhoneNumber={setPhoneNumber}
                setStep={setStep}
              />
            )}
            {step === "verification" && (
              <VerificationId
                setValidId={setValidId}
                setStep={setStep}
                validId={validId}
              />
            )}
            {step === "confirmation" && (
              <CreationAccount handleSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
