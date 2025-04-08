import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useProfile = () => {
    const { user } = useContext(AuthContext);
    return user;
}