import React from "react";
import LogoImage from "/images/logo.png";
import { IoLocationOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { MdOutlinePhone } from "react-icons/md";
import { FaFacebook, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <div>
      <div className="bg-primary text-white">
        <div className="container py-[50px] lg:py-4 flex flex-col gap-10 lg:flex lg:justify-between lg:flex-row sm:relative">
          {/* Logo Footer */}
          <div>
            <a
              href="#"
              className="flex xl:justify-center text-white cursor-pointer font-semibold"
            >
              <img
                src={LogoImage}
                alt=""
                className="w-[115px] h-[115px] cursor-pointer object-center"
              />
            </a>
            <h1 className="py-2 text-xl">Authentique Collectibles</h1>
          </div>
          {/* Footer Center */}
          <div>
            <h1 className="text-[28px] py-2 font-bold">Get in Touch</h1>
            <ul>
              <li className="flex gap-5">
                <IoLocationOutline />
                1067 Manila-Cavite Rd, Santa Cruz, Cavite City, Cavite
              </li>
              <li className="flex gap-5">
                <CiMail />
                authentiquecollectibles@gmail.com
              </li>
              <li className="flex gap-5">
                <MdOutlinePhone />
                0915-155-9970
              </li>
            </ul>
          </div>
          {/* Footer Info */}
          <div>
            <h1 className="text-[28px] py-2 font-bold">Information</h1>
            <h1>About Us</h1>
            <h1>Terms and Condition</h1>
            <h1>FAQ</h1>
          </div>
          {/* Info Icons */}
          <div className="sm:absolute sm:bottom-10 sm:right-0 flex lg:static lg:justify-between gap-10 text-[70px] py-2">
            <a href="https://www.facebook.com/authentiquecollectiblesph">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/authcollph/">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
