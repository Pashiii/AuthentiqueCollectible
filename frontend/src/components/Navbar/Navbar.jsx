import React from "react";
import LogoImage from "/images/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaRegUser, FaBars } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useState } from "react";
import MobileNav from "./MobileNav";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useFetchAllProductsQuery } from "../../redux/features/products/productApi";
import CartNotification from "../CartNotification";
import { useFetchAllCategoryQuery } from "../../redux/features/category/categoryApi";

const SubMenuLinks = [
  {
    id: 1,
    label: "Shop",
    children: [
      {
        id: 11,
        label: "Toy Collectibles",
        link: "",
        children: [],
      },
      {
        id: 12,
        label: "Lifestyle Apparrels",
        link: "/collections/apparel",
      },
      {
        id: 13,
        label: "Coffee and Frappe’",
        link: "",
      },
    ],
  },
  {
    id: 2,
    label: "Pre-Order",
    link: "pre-order",
  },

  {
    id: 3,
    label: "Latest",
    link: "latest-product",
  },
];

function MobileSearch() {
  return (
    <div className="fixed h-screen w-full z-[10] lg:hidden">
      <div className="bg-white shadow-lg h-[60px] w-full py-2 hover:h-full animate-in fade-in-50 zoom-in">
        <div className="bg-secondary flex justify-center mx-4 rounded-[10px] border-black border-2">
          <input
            type="text"
            placeholder="Search"
            className="text-black w-full h-[40px] bg-transparent px-4 outline-none"
          />
          <button className="border-l-2 border-black w-[100px] bg-primary text-white">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const [openChildId, setOpenChildId] = useState(null);
  const [isSideMenuOpen, setSideMenu] = useState(false);
  const [showSearch, setSearch] = useState(false);
  const [activeScroll, setActiveScroll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const { data: { products = [] } = {} } = useFetchAllProductsQuery({});

  const handleProfileDropDown = () => {
    navigate("/account?");
  };

  const handleSuggestionClick = (slug) => {
    navigate(`/product/${slug}`);
    window.location.reload();
  };

  const { data: category = [] } = useFetchAllCategoryQuery();
  const collectibleCategory = category.filter(
    (e) => e.productType === "Collectible"
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredSuggestions = products.filter((s) =>
        s.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  window.addEventListener("scroll", function () {
    if (this.window.scrollY > 350) {
      setActiveScroll(true);
    } else {
      setActiveScroll(false);
    }
  });

  const toggleChild = (id) => {
    setOpenChildId((prevId) => (prevId === id ? null : id));
  };

  const showSidebar = () => setSideMenu(!isSideMenuOpen);

  function toggleSearch() {
    setSearch(!showSearch);
  }

  const cart = useSelector((state) => state.cart.cartItems);

  const { user } = useSelector((state) => state.auth);

  const handleChangeProducts = (slug) => {
    navigate(`/collections/${slug}`);
    window.location.reload();
  };

  return (
    <div
      className={`sticky w-full z-[9999]  ${
        activeScroll
          ? " top-0 opacity-100  transition-opacity-1 duration-500"
          : " top-[-200px] opacity-100 h-[70px] lg:h-full transition-all duration-500"
      }`}
    >
      <MobileNav
        className="transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
        isSideMenuOpen={isSideMenuOpen}
        showSidebar={showSidebar}
      />
      <div className="bg-primary lg:static fixed top-0 left-0 w-full z-[1000]">
        <div className="container py-2 sm:py-4 flex justify-between items-center">
          {/* Logo and Link Section */}
          <div className="flex items-center gap-5 text-white text-2xl">
            <div className="lg:hidden menu-bars">
              <FaBars onClick={showSidebar} />
            </div>
            <Link to="/">
              <div className="text-white cursor-pointer flex items-center gap-3 font-semibold">
                <img
                  src={LogoImage}
                  alt=""
                  className="w-[55px] h-[55px] cursor-pointer"
                />
                <h1 className="hidden lg:block">Authentique Collectibles</h1>
              </div>
            </Link>
          </div>
          {/* Navbar Center Section */}
          <div className="flex justify-between items-center gap-4 ">
            <div className="relative group hidden lg:block ">
              <input
                type="text"
                placeholder="Search"
                className="search-bar text-white placeholder-white"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <IoMdSearch className="text-xl text-white absolute top-1/2 -translate-y-1/2 right-3 duration-200" />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute hidden group-focus-within:block group-hover:block top-12 left-0 bg-secondary  w-full shadow-lg rounded-lg z-10">
                  <div>
                    {suggestions.slice(0, 4).map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion.slug)}
                      >
                        <div className="flex gap-5">
                          <img
                            src={suggestion.image[0].url}
                            alt=""
                            className="w-[100px]"
                          />
                          <div className="flex flex-col gap-2">
                            <h1 className="font-semibold text-xl">
                              {suggestion.title}
                            </h1>
                            <h1>{suggestion.category}</h1>
                            <h1 className="text-xl">
                              ₱
                              {suggestion.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2 text-blue-500 hover:bg-gray-200 cursor-pointer">
                      View all results
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-5 text-white font-semibold	">
              <Link to="/">
                <>
                  <p className="hidden lg:block hover:text-primary hover:bg-secondary rounded-[20px] p-2">
                    Home
                  </p>
                </>
              </Link>
              <Link to="/auction" className="hidden lg:block">
                <p className=" hover:text-primary hover:bg-secondary rounded-[20px] p-2">
                  Auction
                </p>
              </Link>
            </div>
          </div>
          {/* Navbar Right Section */}
          <div className="flex justify-between items-center  text-white ">
            <button
              className="text-[33px] px-2  lg:hidden"
              onClick={toggleSearch}
            >
              <IoMdSearch className="cursor-pointer text-3xl" />
            </button>
            {user ? (
              <>
                <div className="relative">
                  <button
                    className="p-1 sm:p-3"
                    onClick={handleProfileDropDown}
                  >
                    <FaRegUser className="cursor-pointer text-2xl hover:text-[25px]" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <button className="p-1 sm:p-3">
                    <FaRegUser className="cursor-pointer text-2xl hover:text-[25px]" />
                  </button>
                </Link>
              </>
            )}

            <div className="relative w-full">
              <Link to="/cart">
                <button className="relative p-2 sm:p-3">
                  <FiShoppingCart className="cursor-pointer text-2xl hover:text-[25px]" />
                  {cart.length > 0 && (
                    <div className="w-4 h-4 bg-red-500 text-white rounded-full absolute top-0 right-0 flex items-center justify-center text-xs">
                      {cart.reduce((a, c) => a + c.quantity, 0)}
                    </div>
                  )}
                </button>
              </Link>
              <CartNotification />
            </div>
            {/* <div className="relative w-full">
              <button
                className="relative p-2 sm:p-3"
                onClick={handleNotification}
              >
                <MdOutlineNotificationsActive className="text-3xl cursor-pointer" />
                <div className="w-4 h-4 bg-red-500 text-white rounded-full absolute top-1 right-0 flex items-center justify-center text-xs">
                  4
                </div>
              </button>
              {showNotification && <Notifications />}
            </div> */}
          </div>
        </div>
        {/* Sub-Navbar */}
        {showSearch && (
          <MobileSearch isOpen={showSearch} onClose={toggleSearch} />
        )}
        <div>
          <div className="SubMenu hidden lg:block ">
            <div className="flex bg-secondary items-center justify-center py-4">
              <ul className="flex items-center gap-4">
                {SubMenuLinks.map((data, index) => (
                  <li key={data.id} className="relative cursor-pointer group">
                    {data.children ? (
                      <span className="inline-block px-4 font-semibold text-black hover:text-primary duration-200 py-2 cursor-pointer">
                        <span className="flex items-center hover:underline">
                          {data.label}
                          {data.children && (
                            <RiArrowDropDownLine className="group-hover:rotate-180 duration-800 text-xl" />
                          )}
                        </span>
                      </span>
                    ) : (
                      <h1
                        className="inline-block px-4 font-semibold text-black hover:text-primary duration-200 py-2"
                        onClick={() => handleChangeProducts(data.link)}
                      >
                        <span className="flex items-center hover:underline">
                          {data.label}
                          {data.children && (
                            <RiArrowDropDownLine className="group-hover:rotate-180 duration-800 text-xl" />
                          )}
                        </span>
                      </h1>
                    )}
                    {/* Dropdown List */}
                    {data.children && (
                      <div className="absolute z-[9999] hidden group-hover:block w-[180px] rounded-md bg-white shadow-md p-2">
                        <ul className="space-y-2">
                          {data.children.map((childr, index) => (
                            <li
                              key={index}
                              className="relative cursor-pointer group"
                            >
                              {childr.children ? (
                                <span
                                  className="flex items-center font-semibold text-black hover:text-primary"
                                  onClick={() => toggleChild(childr.id)}
                                >
                                  <span className="flex items-center ">
                                    {childr.label}
                                    {openChildId === childr.id ? (
                                      <RiArrowDropDownLine className="rotate-180 duration-800 text-xl" />
                                    ) : (
                                      <RiArrowDropDownLine className="duration-800 text-xl" />
                                    )}
                                  </span>
                                </span>
                              ) : (
                                <Link
                                  to={childr.link}
                                  className="flex items-center font-semibold text-black hover:text-primary"
                                >
                                  <span className="flex items-center">
                                    {childr.label}
                                    {childr.children && (
                                      <>
                                        {openChildId === childr.id ? (
                                          <RiArrowDropDownLine className="rotate-180 duration-800 text-xl" />
                                        ) : (
                                          <RiArrowDropDownLine className="duration-800 text-xl" />
                                        )}
                                      </>
                                    )}
                                  </span>
                                </Link>
                              )}

                              {/* Dropdown Links */}

                              <div>
                                {openChildId === childr.id && (
                                  <div>
                                    <ul>
                                      {collectibleCategory.map(
                                        (secondChild, index) => (
                                          <li key={index} className="py-1">
                                            <a
                                              className="text-gray-500 hover:text-black duration-200 px-2"
                                              onClick={() =>
                                                handleChangeProducts(
                                                  secondChild.category
                                                    .toLowerCase()
                                                    .split(" ")
                                                    .join("-")
                                                )
                                              }
                                            >
                                              {secondChild.category}
                                            </a>
                                          </li>
                                        )
                                      )}
                                      <a
                                        onClick={() =>
                                          handleChangeProducts(
                                            "view-all-products"
                                          )
                                        }
                                      >
                                        <li className="py-2 text-gray-500 hover:text-black duration-200 px-2 underline">
                                          View All
                                        </li>
                                      </a>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
