import React, { useEffect, useState } from "react";
import { useFetchAuctionBySlugQuery } from "../redux/features/auction/auctionApi";
import { useFetchSingleOrderQuery } from "../redux/features/order/orderApi";
import { useNavigate, useParams } from "react-router-dom";
import LoadingTracking from "./LoadingTracking";
import ErrorInput from "./ErrorInput";

function CheckingAuctionCheckout({ children }) {
  const { id, orderId } = useParams();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const {
    data: auction,
    isLoading: auctionLoading,
    error: auctionError,
  } = useFetchAuctionBySlugQuery(id);

  const {
    data: orderAuction,
    isLoading: orderLoading,
    error: orderError,
  } = useFetchSingleOrderQuery(orderId);

  const cartItemsWithProductId =
    orderAuction?.cartItems?.map((item) => item?.productId) || [];

  useEffect(() => {
    if (!auctionLoading && !orderLoading) {
      if (
        auctionError ||
        orderError ||
        !auction?._id ||
        cartItemsWithProductId.length === 0
      ) {
        navigate("/");
        return;
      }

      const auctionMatch = cartItemsWithProductId.includes(auction._id);

      if (!auctionMatch || orderAuction?.orderDate) {
        navigate("/");
      }
    }
    setLoading(false);
  }, [
    auction,
    cartItemsWithProductId,
    auctionLoading,
    orderLoading,
    auctionError,
    orderError,
    navigate,
  ]);

  if (auctionLoading || orderLoading) return <LoadingTracking />;
  if (auctionError || orderError) return <ErrorInput />;
  if (loading) return <LoadingTracking />;
  return <div>{children}</div>;
}

export default CheckingAuctionCheckout;
