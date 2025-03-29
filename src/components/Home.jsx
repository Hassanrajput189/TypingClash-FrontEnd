import { useContext, useState, useEffect } from "react";
import Navbar from "./Navbar";
import TypingInterface from "./TypingInterface";
import MultiplayerInterface from "./MultiplayerInterface"
import Footer from "./Footer";
import context from "../context/context";
import ShowPlayers from "./ShowPlayers";

const Home = () => {
  const { room, players, isMultiplayer, rankedPlayers } = useContext(context);
  const [showMultiFunc, setShowMultiFunc] = useState(false);

  useEffect(() => {
    isMultiplayer ? setShowMultiFunc(true) : setShowMultiFunc(false);
  }, [isMultiplayer]);

  return (
    <div className="bg-[#eeeded] flex flex-col items-center w-full gap-4 min-h-screen">
      <Navbar />
      <div className={`flex flex-col items-center w-full gap-4 flex-grow`}>
        {/* 1. Multiplayer Dashboard */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            showMultiFunc
              ? "translate-y-0 opacity-100"
              : "translate-y-[-100%] opacity-0"
          }`}
        >
          <MultiplayerInterface />
        </div>

        {/* 2. Typing Interface */}
        <div className="block">
          <TypingInterface />
        </div>

        {/* 3. Show Players (Only in multiplayer mode when in a room) */}
        {isMultiplayer && room && players.length > 0 && (
          <div className="w-full max-w-[60vw]">
            <ShowPlayers players={players} />
          </div>
        )}
      </div>
      
      <div className="relative bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Home;



