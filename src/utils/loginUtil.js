import axios from "axios";

export const loginRequest = async (student_id, password) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/api/user/login`, {
            student_id,
            password,
        });
        const user = response.data.user;
        const accessToken = response.data.accessToken;
        return { user, accessToken };
    } catch(err) {
        console.log('login error');
        throw err;
    }
};