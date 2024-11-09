import Cart from "../pages/Cart";
import Product from "../components/Product";
import Register from "../pages/Register";
import Collections from "../pages/Collections";
import Auction from "../pages/Auction";
import AuctionProduct from "../components/AuctionProduct";
import Home from "../pages/Home";
import Login from "../pages/Login/Login";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Admin from "../admin-view/Admin";
import AuthChecking from "../redux/features/auth/AuthChecking";
import ResetChecking from "../redux/features/auth/ResetChecking";
import ForgetPass from "../pages/ForgetPass";
import ResetPassword from "../components/ResetPassword";
import Checkout from "../components/Checkout";
import ToShipOrder from "../components/ToShipOrder";
import Settings from "../pages/Settings";
import Profile from "../components/Account/Profile";
import SecuritySettings from "../components/Account/SecuritySettings";

//admin side
import DashboardAdmin from "../admin-view/DashboardAdmin";
import CategoryAdmin from "../admin-view/CategoryAdmin";
import CustomerAdmin from "../admin-view/CustomerAdmin";
import ProductsAdmin from "../admin-view/ProductsAdmin";
import OrdersAdmin from "../admin-view/OrdersAdmin";
import AuctionAdmin from "../admin-view/AuctionAdmin";
import ProductsList from "../admin-view/components/products/ProductsList";
import AuctionDetails from "../admin-view/components/auctions/AuctionDetails";
import PaymentSuccess from "../components/PaymentSuccess";
import OrderHistory from "../pages/OrderHistory";
import StoreOrders from "../admin-view/components/orders/StoreOrders";
import SingleCustomer from "../admin-view/components/userdetails/SingleCustomer";
import BidderUser from "../admin-view/components/auctions/BidderUser";
import EditAuction from "../admin-view/components/auctions/EditAuction";
import AddAuction from "../admin-view/components/auctions/AddAuction";
import AddProducts from "../admin-view/components/products/AddProducts";
import EditProducts from "../admin-view/components/products/EditProducts";
import SingleOrder from "../admin-view/components/orders/SingleOrder";
import RemainingPayment from "../components/RemainingPayment";
import CategoryMenu from "../admin-view/CategoryMenu";
import SearchPage from "../pages/SearchPage";
import AuctionCheckout from "../components/AuctionCheckout";
import CheckingAuctionCheckout from "../components/CheckingAuctionCheckout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthChecking>
        <App />
      </AuthChecking>
    ),
    children: [
      {
        path: "/signin",
        element: <Login />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "product/:slug",
        element: <Product />,
      },
      {
        path: "signup",
        element: <Register />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "collections/:item",
        element: <Collections />,
      },
      {
        path: "auction",
        element: <Auction />,
      },
      {
        path: "auction/:slug",
        element: <AuctionProduct />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "forget-password",
        element: <ForgetPass />,
      },
      {
        path: "reset-password/:id/:token?",
        element: (
          <ResetChecking>
            <ResetPassword />
          </ResetChecking>
        ),
      },
      {
        path: "checkout/:id/:token?",
        element: (
          <AuthChecking>
            <Checkout />,
          </AuthChecking>
        ),
      },
      {
        path: "payment/processing",
        element: <PaymentSuccess />,
      },
      {
        path: "remaining-payment/processing",
        element: <RemainingPayment />,
      },
      {
        path: "account?",
        element: <OrderHistory />,
      },
      {
        path: "account/:status",
        element: <ToShipOrder />,
      },
      {
        path: "account/settings",
        element: <Settings />,
      },
      {
        path: "account/profile",
        element: <Profile />,
      },
      {
        path: "account/security",
        element: <SecuritySettings />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "auction/checkout/:id/:orderId",
        element: (
          <CheckingAuctionCheckout>
            <AuctionCheckout />
          </CheckingAuctionCheckout>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthChecking>
        <Admin />
      </AuthChecking>
    ),

    children: [
      {
        path: "dashboard",
        element: <DashboardAdmin />,
      },
      {
        path: "customer",
        element: <CustomerAdmin />,
      },
      {
        path: "category",
        element: <CategoryMenu />,
      },
      {
        path: "category/:type",
        element: <CategoryAdmin />,
      },
      {
        path: "auction",
        element: <AuctionAdmin />,
      },
      {
        path: "auction/:title",
        element: <AuctionDetails />,
      },
      {
        path: "products",
        element: <ProductsAdmin />,
      },
      {
        path: "products/:item",
        element: <ProductsList />,
      },
      {
        path: "orders",
        element: <OrdersAdmin />,
      },
      {
        path: "orders/list/:status",
        element: <StoreOrders />,
      },
      {
        path: "customer/:id",
        element: <SingleCustomer />,
      },
      {
        path: "auction/:slug/:id",
        element: <BidderUser />,
      },
      {
        path: "auction/edit/:slug",
        element: <EditAuction />,
      },
      {
        path: "auction/create",
        element: <AddAuction />,
      },
      {
        path: "products/creation",
        element: <AddProducts />,
      },
      {
        path: "products/:item/:slug/update",
        element: <EditProducts />,
      },
      {
        path: "orders/:status/:id",
        element: <SingleOrder />,
      },
    ],
  },
]);

export default router;
