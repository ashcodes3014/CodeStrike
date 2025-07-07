import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,   // automatically attach token 
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

