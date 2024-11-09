import React from "react";

function RulesRegulations({ setShowRulesRegulation }) {
  return (
    <div className="overflow-auto fixed inset-0 z-[9999] grid h-full w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="sticky m-4 p-4 rounded-lg bg-white shadow-sm ">
        <div className="flex shrink-0 justify-center items-center pb-4 mx-5 text-xl font-medium text-slate-800">
          <h1 className="text-4xl my-5">Rules And Regulations</h1>
        </div>
        <div className="relative border-t border-slate-300 py-4 mx-5 leading-normal text-slate-600 font-light text-lg">
          <h1 className="font-bold">User Account</h1>
          <li>
            Users must be 18 years old or older to register. If you are under 18
            years old, a parent or guardian must register and supervise use. Our
            services are not available to children, and we do not accept
            personal information from users under 18 years old.
          </li>
          <li>
            Users must register with a username, email address, and password
          </li>
          <li>
            Users should have the ability to reset their passwords and update
            their security settings.
          </li>
          <li>
            Users is required to submit their VALID ID’S (Government Id’s refer
            below) such as registration, and the information provided will be
            kept confidential.
            <h1 className="ml-10 font-bold">
              {" "}
              Valid Government Identification Cards
            </h1>
            <div className="ml-20">
              <p>- Philippine National ID (PhilSys ID)</p>
              <p>- Social Security System (SSS) ID</p>
              <p>- PhilHealth ID</p>
              <p>- Pag-IBIG ID</p>
              <p>- Driver’s License ID</p>
              <p>- Passport ID</p>
              <p>- Voter’s ID</p>
              <p>- Unified Multi-Purpose ID (UMID)</p>
            </div>
            <h1 className="ml-10 font-bold">Others</h1>
            <div className="ml-20">
              <p> - Police Clearance</p>
              <p> - NBI Clearance</p>
            </div>
          </li>
          <li>
            Users must provide accurate and legitimate information about
            themselves any form of falsification of their personal information
            may result in a ban from the website.
          </li>
          <li>
            Provide options for users to reset their passwords and update their
            security settings.
          </li>
          <h1 className="font-bold">Purchasing Product Items</h1>
          <li>
            A valid ID is required to purchase a product to verify user
            information.
          </li>
          <li>
            Strictly the shop required FULL PAYMENT FIRST in any product to be
            ordered.
          </li>
          <li>
            Full payment must be made through GCash before the delivery
            transaction proceed.
          </li>
          <li>
            Shipping costs will be calculated based on your delivery address and
            will be shouldered by the buyer or customer. You will be notified of
            any additional shipping fees prior to finalizing your order.
          </li>
          <li>
            Orders that fail to meet requirements, such as using false
            identification, will be canceled and may lead to a ban from the
            website.
          </li>
          <li>
            The shop is not responsible for delivery issues, such as when the
            recipient is not at home on the scheduled delivery day.
          </li>
          <li>
            Before purchasing vintage items, please keep in mind that they may
            show variations in color, signs of deterioration, and other effects
            of aging. These factors can impact the item’s appearance and
            condition.
          </li>
          <li>
            By placing your ordered product, you agree to our rules and
            regulations.Failure to comply with these terms may result in
            cancellation of your order and forfeiture of any payments made.
          </li>
          <h1 className="font-bold">Bidding on Auctioned Products</h1>
          <li>
            Bidders must read the detailed information of the auctioned item
            before placing a bid.
          </li>
          <li>
            During registration all participants must be registered on the
            website to participate in auctions.
          </li>
          <li>
            Bidder must provide a valid identification card information during
            registration process.
          </li>
          <li>
            Ensure all bidder information is confidentially stored and used in
            accordance with privacy laws and regulations.
          </li>
          <li>
            Each participant submits their bid without knowing the bids of
            others.
          </li>
          <li>All bids are final and cannot be retracted once placed.</li>
          <li>Each auction will have a specified start and end time.</li>
          <li>
            No bids will be considered after the auction ends. The auction will
            close once the time expires.
          </li>
          <li>
            The highest bid at the end of the auction period will win the
            auction item.
          </li>
          <li>
            Winners will be notified via email and through their account on the
            website.
          </li>
          <li>
            Winners must complete the full payment within a specified timeframe
            (e.g., 48 hours) after the auction ends.
          </li>
          <li>
            Strictly payment first through GCash before we ship the auctioned
            item to the winner.
          </li>
          <li>
            Shipping costs will be calculated based on your delivery address and
            will be shouldered by the buyer or customer. You will be notified of
            any additional shipping fees prior to finalizing your order.
          </li>
          <li>
            If the winning bidder fails to pay within the given timeframe, the
            item will be relisted for auction again.
          </li>
          <li>
            By placing your pre ordered product, you agree to our rules and
            regulations.Failure to comply with these terms may result in
            cancellation of your bidding and forfeiture of any payments made.
          </li>
          <li>
            If the winning bidder fails to submit their legal requirements
            (Valid card identity), the item will be relisted for auction again.
          </li>
          <li>
            Non-payment and cancellation after bidding process could result in
            suspension or banning of the bidder’s account.
          </li>
          <h1 className="font-bold">Pre Order Products </h1>
          <li>
            To pre-order products, you must agree to our terms and conditions
            and we are requiring a valid ID’s.
          </li>
          <li>
            Select the item you wish to pre-order and follow the checkout
            process and you will receive a confirmation email once your
            pre-order is complete.
          </li>
          <li>
            Pre-ordered items will be shipped on or after the official release
            date. Please check the product page for specific release dates.
          </li>
          <li>
            20% down payment of the product’s price is required at the time of
            the pre-order. We strictly only accept GCash payment only{" "}
          </li>
          <li>
            Shipping costs will be calculated based on your delivery address and
            will be shouldered by the buyer or customer. You will be notified of
            any additional shipping fees prior to finalizing your order.
          </li>
          <li>
            Pre-orders are subject to availability. If an item becomes
            unavailable, it will be shown as out of stock in your cart.
          </li>
          <li>
            Any changes to your pre-order, including cancellations or updates,
            will not be accommodated and your down payment will not be
            refundable once you already process your pre-ordered product.
          </li>
          <li>
            For any questions or concerns about your pre-order product, please
            contact us through our social media accounts
          </li>
          <li>
            By placing your pre ordered product, you agree to our rules and
            regulations.Failure to comply with these terms may result in
            cancellation of your pre-order and forfeiture of any payments made.
          </li>
        </div>
        <div className="flex justify-center items-center my-10">
          <button
            type="submit"
            className=" bg-secondary text-black py-2 w-[30%] rounded-lg font-semibold hover:bg-primary hover:text-white transition duration-200"
            onClick={() => setShowRulesRegulation(false)}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

export default RulesRegulations;
