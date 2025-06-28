import { useContext } from "react";
import Navbar from "./Navbar";
import TypingInterface from "./TypingInterface";
import MultiplayerInput from "./MultiplayerInput";
import Footer from "./Footer";
import context from "../context/context";
import ShowPlayers from "./ShowPlayers";
import ShowRooms from "./ShowRooms";


const Manager = () => {
  const {
    players,
    isMultiplayer,
    showMultiInput,
    setShowMultiInput,
    showMultiRooms,
    setShowMultiRooms,
    width,
  } = useContext(context);

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Navbar Component */}
      <Navbar />
        
      <main className="flex flex-col justify-center  items-center px-4 py-8 w-full gap-8">
        
        <div className="w-full flex flex-col lg:flex-row gap-6 justify-center  lg:w-full  md:w-[90%] ">
          
          {/* Multiplayer Component */}
          {showMultiInput && width < 1024 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="relative z-50">
                <MultiplayerInput />
                <button
                  className="absolute top-2 right-2 text-gray-400 bg-gray-700 rounded-full px-[5px] hover:bg-gray-600"
                  onClick={() => setShowMultiInput(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          {width >= 1024 && (
            <div
              className={`w-full lg:w-[20%] transition-all duration-500 ease-in-out transform flex justify-center md:justify-end  ${
                isMultiplayer ? "block" : "hidden"
              }`}
            >
              <div>
                <MultiplayerInput />
              </div>
            </div>
          )}
          {/* Typing Interface */}
          <div className="w-full  lg:w-[65%] flex justify-center">
            <TypingInterface />
          </div>

          {/* Show Rooms (Only in multiplayer mode) */}
          {showMultiRooms && width < 1024 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="relative z-60 ">
                <ShowRooms />
                <button
                  className="absolute top-2 right-2 text-gray-400 bg-gray-700 rounded-full px-[5px] hover:bg-gray-600"
                  onClick={() => setShowMultiRooms(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          {width >= 1024 && (
            <div
              className={`w-full lg:w-[25%]  transition-all duration-500 ease-in-out transform ${
                isMultiplayer ? "block" : "hidden"
              }`}
            >
              <ShowRooms />
            </div>
          )}
        </div>
        {/* Show Players (Only in multiplayer mode) */}
        <div
          className={`w-full transition-all duration-500 ease-in-out transform ${
            isMultiplayer ? "block" : "hidden"
          }`}
        >
          <div className=" bg-gray-800  rounded-xl shadow-lg p-5 border border-gray-700 overflow-y-auto">
            <ShowPlayers players={players} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Manager;
