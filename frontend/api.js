import axios from "axios";
import { Platform } from "react-native";

// Get your machine's IP address by running: ifconfig | grep inet
// Replace 192.168.1.XXX with your actual LAN IP address
// const getApiUrl = () => {
//   if (Platform.OS === 'web') {
//     return "http://localhost:3000";
//   } else {
//     // For mobile devices - replace with your machine's IP
//     // Run this command in terminal to find it: ifconfig | grep "inet " | grep -v "127.0.0.1"
//     return "http://localhost:3000"; // Replace 192.168.1.100 with your actual IP
//   }
// };

const api = axios.create({
  // baseURL: 'http://10.36.211.165:3000/api',
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
