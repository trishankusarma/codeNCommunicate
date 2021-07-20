import axios from 'axios';

import { SERVER_URL } from './constants';

const Instance = axios.create({
  baseURL: SERVER_URL,
  withCredentials:true,
  credentials:'include'
});

export default Instance;