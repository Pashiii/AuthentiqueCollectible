import React, { useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { LuTrash } from "react-icons/lu";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addtoCart, removetoCart } from "../redux/features/cart/cartSlice";

function Cart() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  // const combinedIds = cartItems.map((item) => item._id).join("&");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/`);
        cartItems.forEach((item) => {
          const productInStore = data.products.find(
            (product) => product._id === item._id
          );

          if (productInStore && productInStore.stocks === 0) {
            dispatch(removetoCart(item._id));
          }
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, [cartItems, dispatch]);
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item.slug}`);

    if (data.product.stocks < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch(addtoCart({ ...item, quantity }));
  };

  const removeItemHandler = (item) => {
    dispatch(removetoCart(item._id));
  };

  const handleCheckingToken = async () => {
    const existToken = localStorage.getItem("cartToken");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/create-checkout-token",
        {
          userId: user._id,
          token: existToken,
        }
      );
      const { token } = response.data;
      localStorage.setItem("cartToken", token);
      navigate(`/checkout/${user._id}/${token}`);
    } catch (error) {
      console.error("Error creating checkout token:", error);
    }
  };

  const checkoutHandler = async () => {
    navigate("/signin?redirect=/cart");
  };

  return (
    <div className="container min-h-screen max-h-full">
      <div>
        <div className="flex items-center md:text-[30px] mt-10 gap-2 font-semibold">
          <FiShoppingCart />
          <h1>Shopping Cart</h1>
        </div>
        <div className="flex justify-between font-bold md:text-3xl md:mx-[100px] mt-5">
          <h1>Product</h1>
          <h1>Total</h1>
        </div>
        <div className="flex-grow border-t border-gray-500 border-[1px] mb-5"></div>
        {cartItems.length === 0 ? (
          <div className="flex justify-center items-center flex-col h-[300px] gap-5">
            <div className="font-bold text-3xl">Cart is empty.</div>
            <Link to="/">
              <button className="border-[1px] border-primary p-2 rounded-[10px] bg-secondary text-primary">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="w-full">
            {cartItems.map((data, index) => (
              <div key={index} className="flex p-5 gap-5">
                <img
                  src={data.image[0].url}
                  alt=""
                  className="flex w-[30vh] h-[20vh] md:w-[500px] md:h-[350px]"
                />
                <div className="w-full">
                  <h1 className="font-bold lg:text-2xl py-2">{data.title}</h1>
                  <h1 className="text-xl">{data.category}</h1>
                  <div className="flex justify-between lg:text-2xl font-semibold py-5">
                    <h1>
                      {data.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h1>
                    <h1 className="mr-[50px]">
                      ₱
                      {(data.quantity * data.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h1>
                  </div>

                  <h1>Quantity</h1>
                  <div className="border-black border-[1px] h-[20px] w-[80px] rounded-[5px] shadow-md px-2 flex items-center justify-between">
                    <button
                      className=" font-bold cursor-pointer "
                      onClick={() => updateCartHandler(data, data.quantity - 1)}
                      disabled={data.quantity === 0}
                    >
                      -
                    </button>
                    <span className="font-bold">{data.quantity}</span>
                    <button
                      className="font-bold cursor-pointer "
                      onClick={() => updateCartHandler(data, data.quantity + 1)}
                      disabled={data.quantity === data.stocks}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="m-5 p-2 rounded-[10px] text-xl bg-red-500 text-white"
                    onClick={() => removeItemHandler(data)}
                  >
                    <LuTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex-grow border-t border-gray-500 border-[1px] mb-5"></div>
        {cartItems.length > 0 && (
          <div className="text-right px-[50px]">
            <h1 className="lg:text-2xl">
              Total Ammount({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
              items): ₱
              {cartItems
                .reduce((a, c) => a + c.price * c.quantity, 0)
                .toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </h1>
            {user ? (
              <button
                className="border-gray-500 border-[1px] bg-[gray] text-white my-5 md:w-[300px] md:h-[45px] rounded-[10px]"
                onClick={handleCheckingToken}
              >
                Proceed for Transaction
              </button>
            ) : (
              <button
                className="border-gray-500 border-[1px] bg-[gray] text-white my-5 md:w-[300px] text-sm w-[180px] h-[40px] md:h-[45px] rounded-[10px]"
                onClick={checkoutHandler}
              >
                Proceed for Transaction
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
