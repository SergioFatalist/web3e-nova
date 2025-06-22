import axios from "axios";

const instanceInstance = axios.create({
  timeout: 10000,
  withCredentials: true,
});

export default instanceInstance;
