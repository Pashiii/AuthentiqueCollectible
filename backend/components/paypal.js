import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox",
  client_id:
    "Aa8BH15w_4mZJ9uAMUAaNtM8SxHrTiC7-ybiJ6G74jpKsOQmMckr-EH8ENS-iJZEK-WzvlBfyMCCr-yT",
  client_secret:
    "ECGvV4bePGGwoylz2WYJY7L8Eu-t6zTgxxfuuMfugUNpQ7AJLHYyLBuJDQWX2bhMQHKkvI9dDKjOV4q4",
});

export default paypal;
