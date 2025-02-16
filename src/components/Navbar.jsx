import React from "react";

const Navbar = () => {
  return (
    <nav
      className="flex fixed justify-between items-center h-16 bg-white text-black relative shadow-sm font-mono mx-5"
      role="navigation"
    >
      <p>Home</p>
      <p>Plant</p>
      <p>Session</p>
    </nav>
  );
};

export default Navbar;
