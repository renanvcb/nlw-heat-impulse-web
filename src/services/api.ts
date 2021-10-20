// Here we'll connect with backend
import axios from "axios"

export const api = axios.create({
  baseURL: 'http://localhost:4000',
});

