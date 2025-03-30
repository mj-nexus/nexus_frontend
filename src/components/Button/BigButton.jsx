import React from "react";

// 기본 내보내기로 변경
const BigButton = (props) => {
    const { label, width, height, fontSize, onClick } = props;

    const buttonStyle = {
        width: width || '200px',
        height: height || '50px',
        fontSize: fontSize || '16px',
        backgroundColor: '#0ea300',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        cursor: 'pointer',
        border: 'none',
        margin: '20px 0'
    };

    return (
        <div style={buttonStyle} onClick={onClick}>
            <p style={{ margin: 0, 
        fontWeight: 'bold', }}>{label}</p> 
        </div>
    );
};

export default BigButton;
