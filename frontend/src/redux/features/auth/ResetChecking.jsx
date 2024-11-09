import axios from "axios";
import React, { useEffect, useState } from "react";
import ErrorInput from "../../../components/ErrorInput";
import { Navigate, useParams } from "react-router-dom";
import LoadingTracking from "../../../components/LoadingTracking";

function ResetChecking({ children }) {
  const { id, token } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const { data } = await axios.get(`/api/auth/user/${id}`);
        console.log(data);
        setUser(data);
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [id]);

  if (loading) return <LoadingTracking />;

  if (error) return <ErrorInput />;

  if (!user) return <div>User not found</div>;

  const { resetPasswordToken, resetPasswordExpireAt } = user;

  const expirationTime = new Date(resetPasswordExpireAt).getTime();
  const currentTime = Date.now();

  if (resetPasswordToken !== token || expirationTime < currentTime) {
    return <Navigate to="/signin" />;
  }

  return <div>{children}</div>;
}

export default ResetChecking;
