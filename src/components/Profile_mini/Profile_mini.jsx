import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

export default ProfileMini = ({ img_uri, nick_name, name }) => {
    return (
        <div className="flex items-center gap-3.5">
          <Avatar className="h-[55px] w-[55px]">
            <AvatarImage src={img_uri} alt={name} />
            <AvatarFallback>PC</AvatarFallback>
          </Avatar>
    
          <div className="flex flex-col gap-[3px]">
            <h3 className="font-semibold text-xl text-black tracking-normal leading-normal">
              {nick_name}
            </h3>
            <p className="font-semibold text-xs text-[#b1b1b1] tracking-normal leading-normal">
              {name}
            </p>
          </div>
        </div>
      );
};