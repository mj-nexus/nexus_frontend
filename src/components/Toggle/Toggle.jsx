import React, { useState } from "react";
import "./style.scss";

const Toggle = () => {
    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
        setIsToggled((prev) => !prev);
    };

    return (
        <div className={`toggle-container ${isToggled ? "active" : ""}`} onClick={handleToggle}>
            <div className={`toggle ${isToggled ? "active" : ""}`}></div>
        </div>
    );
};

export default Toggle;
