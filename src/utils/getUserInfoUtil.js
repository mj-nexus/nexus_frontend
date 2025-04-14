import axios from "axios";

export const getUserInfo = async () => {
    const uerId = localStorage.getItem('userId');
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/user/getUserById/${uerId}`);
    return response.data;
}