import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StoreProvider } from "./components/Store.jsx";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import router from "./routers/routers.jsx";
import { store } from "./redux/store.js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StoreProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </StoreProvider>
  </React.StrictMode>
);
