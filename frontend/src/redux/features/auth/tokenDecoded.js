import jwt_decode from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime; // Check if token has expired
  } catch (error) {
    return true; // If token is invalid or can't be decoded
  }
};
