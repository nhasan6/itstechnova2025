import axios from "axios";

// change this IP to your machine's LAN IP so Expo on phone can reach it
const API_URL = "http://localhost:3000/api";  

export default axios.create({
  baseURL: API_URL,
});
