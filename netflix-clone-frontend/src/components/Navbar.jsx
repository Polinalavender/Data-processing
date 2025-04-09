import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ currentProfile, allProfiles }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const referralLink = `${window.location.origin}/register?ref=${user?.id}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  const profile = currentProfile || { // Default profile if none is provided
    name: "User",
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => { // Close profile menu when clicking outside
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest(".profile-menu-container")) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <header
      className={`flex items-center justify-between px-12 py-4 ${
        isScrolled
          ? "bg-black"
          : "bg-gradient-to-b from-black/80 to-transparent"
      } fixed w-full z-10`}
    >
      <div className="flex items-center">
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png"
            alt="Netflix"
            className="h-7"
          />
        </Link>
        <nav className="ml-8 hidden md:flex">
          <ul className="flex space-x-6">
            <li
              className={`text-sm ${
                location.pathname === "/"
                  ? "font-medium"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <Link to="/">Home</Link>
            </li>
            <li className="text-sm text-gray-300 hover:text-white">
              <Link to="/tvshows">TV Shows</Link>
            </li>
            <li className="text-sm text-gray-300 hover:text-white">
              <Link to="/movies">Movies</Link>
            </li>
            <li className="text-sm text-gray-300 hover:text-white">
              <Link to="/new">New & Popular</Link>
            </li>
            <li className="text-sm text-gray-300 hover:text-white">
              <Link to="/mylist">My List</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <svg
          className="w-5 h-5 cursor-pointer"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          ></path>
        </svg>
        <svg
          className="w-5 h-5 cursor-pointer"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
        </svg>

        <div className="relative group">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
            alt="Profile"
            className="h-8 w-8 rounded cursor-pointer"
          />
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
            <div
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate("/profile-management")}
            >
              Manage Profiles
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={copyReferral}
            >
              Refer & Earn €2
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate("/account")}
            >
              Account
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Sign out
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
