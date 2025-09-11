import React from "react";

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => (
  <header className="relative flex justify-between pt-1 pb-2 px-1 min-h-[60px]">
    <div className="order-first w-full pt-4 text-xl font-semibold leading-snug text-left">
      <h1 className="pd-2 text-5xl font-semibold leading-snug text-left" style={{ color: '#2a2a86' }}>{pageTitle}</h1>
      <hr className="max-w-[970px] h-[2px] border-0 rounded-full bg-gradient-to-r from-blue-950 to-blue-50 via-blue-400" />
    </div>

<img
      src="/liser_logo.png"
      alt="LISER Logo"
      className=" absolute h-23 w-[240px] right-0 top-2"
    />
    
  </header>
);

export default Header;
