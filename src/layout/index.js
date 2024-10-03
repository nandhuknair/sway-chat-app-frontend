import React from "react";
import  logo  from "../assets/sway-logo.png";

const AuthLayouts = ({ children }) => {
  return (
    <>
      <header className="flex flex-col items-center justify-center bg-black mb-0">
        <img 
        src={logo}
        alt="logo"
        width={100}
        height={60}
        />
      </header>

      {children}
    </>
  );
};

export default AuthLayouts;
