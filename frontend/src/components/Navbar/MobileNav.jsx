import React, { useState, useEffect } from "react";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";

const SubMenuLinks = [
  {
    id: 1,
    label: "Shop",
    link: "/#",
    children: [
      {
        id: 11,
        label: "Toy Collectibles",
        link: "/#",
        children: [
          {
            id: 111,
            label: "Dc",
            link: "/#",
          },
          {
            id: 112,
            label: "Marvel",
            link: "/#",
          },
          {
            id: 113,
            label: "NBA",
            link: "/#",
          },
        ],
      },
      {
        id: 12,
        label: "Lifestyle Apparrels",
        link: "/#",
      },
      {
        id: 13,
        label: "Coffee and Frappe’",
        link: "/#",
      },
    ],
  },
  {
    id: 2,
    label: "Pre-Order",
    link: "/#",
  },
  {
    id: 3,
    label: "Flash Sales",
    link: "/#",
  },
  {
    id: 4,
    label: "Latest",
    link: "/#",
  },
];

function MobileNav({ isSideMenuOpen, showSidebar }) {
  const [openChildId, setOpenChildId] = useState(null);
  const [openSubChildId, setOpenSubChildId] = useState(null);

  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSideMenuOpen]); // Function to toggle the open state of a child
  const toggleChild = (id) => {
    setOpenChildId((prevId) => (prevId === id ? null : id));
    setOpenSubChildId(null); // Close any open sub-menus
  };

  // Function to toggle the open state of a sub-child
  const toggleSubChild = (id) => {
    setOpenSubChildId((prevId) => (prevId === id ? null : id));
  };
  return (
    <div className={isSideMenuOpen ? "nav-bg active" : "nav-bg"}>
      <div className={isSideMenuOpen ? "nav-menu active" : "nav-menu"}>
        <div className="flex justify-end">
          <IoMdClose className="text-black text-[40px]" onClick={showSidebar} />
        </div>
        <div className="">
          <div>
            <ul className="py-[25px] text-black flex flex-col gap-[20px] text-[25px] ">
              <li className="shadow-md border-black py-2">Home</li>
              <li className="shadow-md border-black py-2">Auction</li>
              {SubMenuLinks.map((data, index) => (
                <li
                  key={data.id}
                  className="relative cursor-pointer group shadow-lg border-black py-2"
                >
                  <a href={data.link} onClick={() => toggleChild(data.id)}>
                    <span className="flex items-center justify-between">
                      {data.label}
                      {data.children && (
                        <>
                          {openChildId === data.id ? (
                            <RiArrowDropDownLine className="rotate-180 duration-800 text-[30px]" />
                          ) : (
                            <RiArrowDropDownLine className="duration-800 text-[30px]" />
                          )}
                        </>
                      )}
                    </span>
                  </a>
                  {data.children && (
                    <>
                      {openChildId === data.id && (
                        <div className="w-[full] rounded-md p-2">
                          <ul className="space-y-2">
                            {data.children.map((childr, index) => (
                              <li className="relative cursor-pointer group">
                                <a
                                  href={childr.link}
                                  onClick={() => toggleSubChild(childr.id)}
                                  className="font-semibold text-black"
                                >
                                  <span className="text-[18px] min-[370px]:text-xl flex items-center justify-between gap">
                                    {childr.label}
                                    {childr.label && (
                                      <>
                                        {openSubChildId === childr.id ? (
                                          <RiArrowDropDownLine className="rotate-180 duration-800 text-xl" />
                                        ) : (
                                          <RiArrowDropDownLine className="duration-800 text-xl" />
                                        )}
                                      </>
                                    )}
                                  </span>
                                </a>
                                {childr.children && (
                                  <div>
                                    {openSubChildId === childr.id && (
                                      <div>
                                        <ul>
                                          {childr.children.map(
                                            (secondChild, index) => (
                                              <li className="py-[2px]">
                                                <a
                                                  href={secondChild.link}
                                                  className="text-black duration-200 px-2 text-[18px]"
                                                >
                                                  {secondChild.label}
                                                </a>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
