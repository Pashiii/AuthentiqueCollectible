import React from "react";
import Banner from "../components/Banner";
import FlashSale from "../components/FlashSale";
import LatestProduct from "../components/LatestProduct";
import PreOrderProducts from "../components/PreOrderProducts";
import { useFetchAllProductsQuery } from "../redux/features/products/productApi";
import LoadingTracking from "../components/LoadingTracking";
import ErrorInput from "../components/ErrorInput";

function Home() {
  const {
    data: { products = [] } = {},
    error,
    isLoading,
  } = useFetchAllProductsQuery(
    {},
    { pollingInterval: 1000, refetchOnFocus: true, refetchOnReconnect: true }
  );
  const collectibles = products.filter((e) => e.item === "Collectible");
  const updateQuantity = (amount) => {
    if (quantity + amount > products.stocks || quantity + amount < 1) return;
    setQuantity(quantity + amount);
  };
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;

  return (
    <div className="container">
      <Banner />

      <div>
        <div className="text-center">
          <h1 data-aos="fade-up" className="font-bold sm:text-2xl text-xl">
            Authentique Collectibles
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="m-5 sm:text-base py-2 text-sm"
          >
            AUTHENTIQUE COLLECTIBLES is a hobby store that sells ORIGINAL
            collectible TOYS, NBA CARDS, SHOES, BAGS, CAPS, and LIFESTYLE
            APPAREL from the US and JAPAN. We also have ICED COFFEE & FRAPPE
            that will surely satisfy your daily coffee cravings!
          </p>
        </div>
      </div>
      <FlashSale products={collectibles} />
      <LatestProduct products={collectibles} />
      <PreOrderProducts products={collectibles} />
      {/* <Products products={products} /> */}
    </div>
  );
}

export default Home;
