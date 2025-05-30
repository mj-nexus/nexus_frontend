import axios from "axios";

export const loginRequest = async (student_id, password) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/api/user/login`, {
            student_id,
            password,
        });
        const name = response.data.user.Profile.user_name;
        const userid = response.data.user.user_id;
        const accessToken = response.data.accessToken;
        return { name, userid, accessToken };
    } catch(err) {
        console.log('login error');
        throw err;
    }
};