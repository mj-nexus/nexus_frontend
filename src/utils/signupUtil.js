import axios from "axios";

export const signupSubmit = async (userData) => {
    try {
      const payload = {
        name: userData.name,
        student_id: userData.studentId,
        email: userData.email,
        password: userData.password,
        company: userData.company,
        phone: userData.phone,
        skill: userData.skill?.map(skill => skill.name) || [],
      };
  
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_HOST}/api/user/register`,
        payload
      );
  
      return response.data;
    } catch (err) {
      throw err;
    }
  };
  