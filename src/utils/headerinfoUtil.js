// utils/headerinfoUtil.js
import axios from "axios";

export const headerinfoUtil = async (userId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/user/getUserById/${userId}`
    );
    return response.data;
  } catch (err) {
    console.error("유저 정보 요청 중 오류:", err);
    throw err;
  }
};
