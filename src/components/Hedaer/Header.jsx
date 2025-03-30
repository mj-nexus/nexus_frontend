import React from "react";
import Notification1 from "../../assets/notiIcon.png";
import maskGroup from "./pexels-julia-volk-5273755 1.png";
import nexuslogo1 from "../../assets/NexusLogo1.png";
import "./style.scss";

export const Header = () => {
  const user_info = {
    img_uri: maskGroup,
    user_id: "pchan_u",
    user_name: "박찬유",
  };
  return (
    <header>
      <div className="logo">
        <img className="nexuslogo" src={nexuslogo1} alt="logo" />
      </div>
      <div className="profile_group">
      <div className="group">
          <img src={user_info.img_uri} alt="img" />
        <div className="text-wrapper">
          <p>{user_info.user_id}</p>
          <p>{user_info.user_name}</p>
        </div>
      </div>
      <div className="noti_bg">
        <img src={Notification1} alt="noti" />
      </div>
      </div>
      
    </header>
  );
};
