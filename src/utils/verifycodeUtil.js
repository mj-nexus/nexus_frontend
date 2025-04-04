import axios from "axios";

export const verifyCode = async (email, code) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/api/user/verifyCode`, {
            email,
            code
        })
       if (response.status === 200) {
        return true
       }
       else {
        return false
       }
    }
    catch(err) {
        console.log('invalid Code');
        throw err;
    }
}