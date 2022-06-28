import axios from "axios";


export const API    = axios.create({
    baseURL : process.env.REACT_APP_SERVER_URL_API,
    headers : {
        Authorization : `Bearer ${localStorage.token}`
    }
});

// export const setAuthToken   = token => {
//     if (token) {
//         return API.defaults.headers.common['Authorization']    = `Bearer ${token}`;
//     } else if(token === undefined) {
//         delete API.defaults.headers.common['Authorization'];
//     }
// }