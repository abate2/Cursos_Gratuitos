// API Base URL Configuration
// Use window.location.origin to dynamically get the API URL in production

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

export default API_BASE_URL;
