import React, { useState } from "react";
import { MdError } from "react-icons/md";

function CreateDetails({
  firstname,
  setFirstname,
  lastname,
  setLastname,
  day,
  setDay,
  month,
  setMonth,
  year,
  setYear,
  email,
  setEmail,
  handleNext,
  message,
}) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );
  const [reEmail, setReEmail] = useState("");
  const [error, setError] = useState("");
  const handleEmailConfirmation = (e) => {
    e.preventDefault();
    if (reEmail !== email) {
      setError("Your email is not match");
    } else {
      setError("");
      handleNext();
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-5">Sign Up</h1>
      <div className="h-[3px] bg-white mt-5"></div>
      <p className="italic mb-3">Please fill up the following details</p>
      {error && (
        <p className="text-red-400 flex items-center gap-2 text-base mb-2">
          <MdError />
          {error}
        </p>
      )}
      {message && (
        <p className="text-red-400 flex items-center gap-2 text-base mb-2">
          <MdError />

          {message}
        </p>
      )}

      <form onSubmit={handleEmailConfirmation}>
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-lg">Firstname:</label>
            <input
              type="text"
              placeholder="Enter your firstname"
              className="bg-transparent border-white border-[1px] w-full p-2 rounded-lg "
              onChange={(e) => setFirstname(e.target.value)}
              value={firstname}
              required
            />
          </div>
          <div>
            <label className="block text-lg">Lastname:</label>
            <input
              type="text"
              placeholder="Enter your lastname"
              className="bg-transparent border-white border-[1px] w-full p-2 rounded-lg"
              onChange={(e) => setLastname(e.target.value)}
              value={lastname}
              required
            />
          </div>
        </div>

        <h1 className="block text-lg">Birthday:</h1>
        <div className="flex gap-2">
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            style={{ color: day === "" ? "#b3b3b3" : "" }}
            className="bg-transparent border-white border-[1px] outline-none rounded-[10px] w-full p-2"
          >
            <option value="" disabled>
              Day
            </option>
            {days.map((d) => (
              <option key={d} value={d} className="text-black">
                {d}
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ color: month === "" ? "#b3b3b3" : "" }}
            className="bg-transparent border-white border-[1px] outline-none rounded-[10px] w-full p-2"
          >
            <option value="" disabled>
              Month
            </option>
            {months.map((m) => (
              <option key={m} value={m} className="text-black">
                {m}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ color: year === "" ? "#b3b3b3" : "" }}
            className="bg-transparent border-white border-[1px] outline-none rounded-[10px] w-full p-2"
          >
            <option value="" disabled>
              Year
            </option>
            {years.map((y) => (
              <option key={y} value={y} className="text-black">
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-5">
          <label className="block text-lg">Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-transparent border-white border-[1px] w-full p-2 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mt-5">
          <label className="block text-lg">Re-enter your email:</label>
          <input
            type="email"
            placeholder="Re-enter your email"
            className="bg-transparent border-white border-[1px] w-full p-2 rounded-lg"
            value={reEmail}
            onChange={(e) => setReEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-center py-5 mx-auto">
          <button
            type="submit"
            className="w-full bg-white text-black p-2 rounded-lg hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
}

export default CreateDetails;
