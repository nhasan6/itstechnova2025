import axios from "axios";
import Constants from "expo-constants";

// change this IP to your machine's LAN IP so Expo on phone can reach it
const API_URL = "http://192.168.X.X:3000";  

export default axios.create({
  baseURL: API_URL + "/api",
});
