import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useLogout = () => {
    const { logout } = useContext(AuthContext);


}