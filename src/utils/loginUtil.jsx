import axios from "axios";

export const loginRequest = async (student_id, password) => {
    try {
        const respone = await axios.post(process.env.REACT_APP_BACKEN_HOST, {
            student_id,
            password,
        });
        const user = respone.data.user;
        const accessToken = respone.data.accessToken;
        return { user, accessToken };
    }
    catch(err) {
        console.log('login error');
        throw err;
    }
};