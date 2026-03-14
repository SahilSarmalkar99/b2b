import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  {
    name: "Display Society",
    path: "/",
  },
  {
    name: "Create Society",
    path: "/createsociety",
  },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="w-full bg-blue-500 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-800">
          Society<span className="text-blue-600">Admin</span>
        </h1>

        {/* Links */}
        <div className="flex items-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              className={`relative font-medium transition duration-200
              
              ${
                location.pathname === link.path
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }

              after:absolute after:left-0 after:-bottom-1
              after:h-[2px] after:w-0 after:bg-blue-500
              hover:after:w-full after:transition-all after:duration-300
              `}
            >
              {link.name}
            </Link>
          ))}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;