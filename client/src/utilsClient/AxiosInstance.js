import axios from 'axios';

import { CLIENT_URL } from './constants';

const Instance = axios.create({
  baseURL: CLIENT_URL,
  withCredentials:true,
  credentials:'include'
});

export default Instance;