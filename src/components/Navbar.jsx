import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import context from "../context/context";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config";

const Navbar = () => {
  const {
    socket,
    textEasy,
    textMedium,
    textHard,
    room,
    setPlayers,
    setRoom,
    setRoomHistory,
    isMultiplayer,
    setCurrentText,
    setIsMultiplayer,
    setIsLogedIn,
    userName,
    setShowMultiInput,
    setShowMultiRooms
  } = useContext(context);
  const navigate = useNavigate();
  const [isModesOpen, setIsModesOpen] = useState(false);
  const [isLevelsOpen, setIsLevelsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      if(isMultiplayer){
        socket.emit("leaveRoom",room)
        setRoom("");
        setIsMultiplayer(false);
        setPlayers([]);
        socket.disconnect();
      }
      const response = await axios.get(`${API_URL}/api/users/logout`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success(response.data.message);
      setIsLogedIn(false);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Unknown error");
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-700">
      {/* Mobile Navbar */}
      <div className="flex lg:hidden items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <button onClick={() => setSidebarOpen(true)} className="mr-2">
            {/* Hamburger Icon */}
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img src="vite.svg" alt="Logo" className="w-8 h-8" />
          <span className="ml-2 text-indigo-400 font-semibold">Typing Clash</span>
        </div>
        <div className="text-gray-300 font-medium">
          {userName ? userName : "Guest"}
        </div>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 transition-opacity duration-300 ${
          sidebarOpen ? "block" : "hidden"
        } md:hidden`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg p-6 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
          <div className="flex flex-col space-y-6 mt-8">
            <div className="text-gray-300 font-medium">
              {isMultiplayer ? (
                <button
                onClick={() => setShowMultiRooms(true)}
                className="w-full text-left px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 mb-2"
                >
                Available Rooms
              </button>)
              :
              (
                <span className="text-gray-300 font-medium text-xs">
                  enable multiplayer to see rooms
                </span>
              )}                
            </div>
            {/* Modes Dropdown */}
            <div>
              <button
                onClick={() => setIsModesOpen(!isModesOpen)}
                className="w-full text-left px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 mb-2"
              >
                Modes
              </button>
              {isModesOpen && (
                <div className="ml-4">
                  <button
                    onClick={() => {
                      setIsMultiplayer(false);
                      setIsModesOpen(false);
                      setSidebarOpen(false);
                      setShowMultiInput(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Single Player
                  </button>
                  <button
                    onClick={() => {
                      setIsMultiplayer(true);
                      setIsModesOpen(false);
                      setSidebarOpen(false);
                      setShowMultiInput(true);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Multiplayer
                  </button>
                </div>
              )}
            </div>
            {/* Levels Dropdown */}
            <div>
              <button
                onClick={() => setIsLevelsOpen(!isLevelsOpen)}
                className="w-full text-left px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 mb-2"
              >
                Levels
              </button>
              {isLevelsOpen && (
                <div className="ml-4">
                  <button
                    onClick={() => {
                      setCurrentText(textEasy);
                      setIsLevelsOpen(false);
                      setSidebarOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => {
                      setCurrentText(textMedium);
                      setIsLevelsOpen(false);
                      setSidebarOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => {
                      setCurrentText(textHard);
                      setIsLevelsOpen(false);
                      setSidebarOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Hard
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 ">
            <div className="flex items-center">
              <div className="flex-shrink-0 ">
                <img src="vite.svg" alt="error loading image" />
              </div>
              <div className="ml-3">
                <span className="text-indigo-400 font-semibold">
                  Typing Clash
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center md:space-x-4 space-y-4 flex-col md:flex-row ">
              <div className="text-gray-300 font-medium">
                {userName ? userName : "Guest"}
              </div>
              {/* Modes Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsModesOpen(!isModesOpen)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Modes
                  <svg
                    className="ml-2 -mr-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isModesOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => {
                          setIsMultiplayer(false);
                          setIsModesOpen(false);
                          setShowMultiInput(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        role="menuitem"
                      >
                        Single Player
                      </button>
                      <button
                        onClick={() => {
                          setIsMultiplayer(true);
                          setIsModesOpen(false);
                          setShowMultiInput(true);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        role="menuitem"
                      >
                        Multiplayer
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Levels Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLevelsOpen(!isLevelsOpen)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Levels
                  <svg
                    className="ml-2 -mr-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isLevelsOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => {
                          setCurrentText(textEasy);
                          setIsLevelsOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        role="menuitem"
                      >
                        Easy
                      </button>
                      <button
                        onClick={() => {
                          setCurrentText(textMedium);
                          setIsLevelsOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        role="menuitem"
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => {
                          setCurrentText(textHard);
                          setIsLevelsOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        role="menuitem"
                      >
                        Hard
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;