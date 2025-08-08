import React from "react";

interface HeaderProps {
    pageTitle: string;
    // Optional back handler
  }

  const Header: React.FC<HeaderProps> = ({ pageTitle }) => (
        <div className="">
            {/* 1st row: Title left, Logo right */}
            <div className="flex justify-between">
                <div className="order-1">
              <p className="text-2xl">
                {pageTitle}
              </p>
              </div>
            
              <div className="order-2">
              <img src="/liser_logo.png" alt="Logo" className="h-48 w-96 item-contain" />
              </div>
              </div>
            </div>
    )
export default Header;
  