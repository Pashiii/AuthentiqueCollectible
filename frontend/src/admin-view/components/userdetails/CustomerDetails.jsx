import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";

function CustomerDetails({ user, formatDate, handleUserSelection }) {
  const [search, setSearch] = useState("");
  const [sortCriteria, setSortCriteria] = useState("A-Z");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  const userOnly = user.filter((u) => u.role === "user");
  const filteredUsers = userOnly.filter((u) => {
    const fullName = `${u.firstname} ${u.lastname}`.toLowerCase();
    const email = u.email.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortCriteria) {
      case "A-Z":
        const nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
        const nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
        return nameA.localeCompare(nameB);
      case "Z-A":
        const nameX = `${b.firstname} ${b.lastname}`.toLowerCase();
        const nameZ = `${a.firstname} ${a.lastname}`.toLowerCase();
        return nameX.localeCompare(nameZ);
      case "Newest":
        return new Date(b.createdAt) - new Date(a.createdAt); // Most recent first
      case "Oldest":
        return new Date(a.createdAt) - new Date(b.createdAt); // Least recent first
      default:
        return 0;
    }
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  console.log(sortedUsers);
  return (
    <div>
      <h1 className="text-3xl font-bold">All Customers</h1>
      <div className="flex-grow border-t border-black border-[2px]"></div>
      <div className="flex items-center pt-2 justify-between ">
        <div className="flex items-center justify-between relative w-[25%] bg-red-500">
          <input
            type="text"
            placeholder="Search..."
            className="border-black border-[1px] w-full outline-none bg-secondary p-1 "
            onChange={(e) => setSearch(e.target.value)}
          />
          <IoMdSearch className="absolute right-2" />
        </div>
        <div className="flex justify-center items-center">
          <h1>Sort by: </h1>
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="ml-2 border border-black bg-secondary p-1"
          >
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
            <option value="Newest">New</option>
            <option value="Oldest">Old</option>
          </select>
        </div>
      </div>
      <div className="flex justify-center items-center pt-3">
        <table className="min-w-full bg-gray-200 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-primary text-white">
              <th className="py-2 px-4 border">User ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Joining Date</th>
              <th className="py-2 px-4 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={user._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } border-b`}
              >
                <td className="py-2 px-4 border">{user._id}</td>
                <td className="py-2 px-4 border">
                  {user.firstname + " " + user.lastname}
                </td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">
                  {formatDate(user.createdAt)}
                </td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-[#B5B5B5] text-white py-1 px-5 rounded-[20px] hover:bg-primary"
                    onClick={() => {
                      handleUserSelection(user._id);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center pt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CustomerDetails;
