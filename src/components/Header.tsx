import React from "react";

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => (
  <header className="flex items-start justify-between pt-1 pb-2 px-1 min-h-[60px]">
    <h1 className="text-xl font-semibold leading-snug text-left">
      {pageTitle}
    </h1>
    <img
      src="/liser_logo.png"
      alt="LISER Logo"
      className="h-14 w-auto object-contain"
    />
  </header>
);

export default Header;
