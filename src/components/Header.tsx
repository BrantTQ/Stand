import React from "react";

interface HeaderProps {
    pageTitle: string;
    // Optional back handler
  }

  const Header: React.FC<HeaderProps> = ({ pageTitle }) => (
        <div className="">
            {/* 1st row: Title left, Logo right */}
            <div className="flex justify-between">
                <div className="flex item-center justify-center order-1">
              {/* <h1 className="text-2xl"> */}
                <h1>
                {pageTitle}
              </h1>
              </div>
            
              <div className="order-2">
              <img src="/liser_logo.png" alt="Logo" className="h-30 item-contain" />
              </div>
              </div>
            </div>
    )
export default Header;
  