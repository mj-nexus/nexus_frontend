import axios from "axios";

export const emailSent = async (email) => {
    try {
        await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/api/user/sendVerificationCode`, {
            email: email
        });
    } catch(err) {
        console.log('send error');
        throw err;
    }
};
