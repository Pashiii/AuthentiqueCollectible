import React from "react";
import { useGetUserQuery } from "../redux/features/auth/authApi";
import CustomerDetails from "./components/userdetails/CustomerDetails";
import { useNavigate } from "react-router-dom";
import LoadingTracking from "../components/LoadingTracking";
import ErrorInput from "../components/ErrorInput";

function CustomerAdmin() {
  const navigate = useNavigate();

  const handleUserSelection = (selectedUser) => {
    navigate(`/admin/customer/${selectedUser}`);
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-PH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const { data: user = [], isLoading, error } = useGetUserQuery();
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div>
      <CustomerDetails
        user={user}
        formatDate={formatDate}
        handleUserSelection={handleUserSelection}
      />
    </div>
  );
}

export default CustomerAdmin;
