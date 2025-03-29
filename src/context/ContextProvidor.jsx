import { useState, useMemo } from "react";
import io from "socket.io-client";
import UserContext from "./context";
const ContextProvidor = ({ children }) => {
  
  
  const socket = useMemo(() => {
    return io("http://localhost:5000", { 
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
  }, []); 
  
  const maxTime = 60;
  const [mistakes, setMistakes] = useState(0);
  const [WPM, setWPM] = useState(0);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [isTyping, setIsTyping] = useState(false);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [room, setRoom] = useState("");
  const [rankedPlayers,setRankedPlayers] = useState([]);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMobile,setIsMobile] = useState(false);
  const [isPC,setIsPC] = useState(false);
  const [players, setPlayers] = useState([]);  
  return (
    <UserContext.Provider
      value={{
        socket,
        maxTime,
        text1,
        text2,
        text3,
        WPM,
        mistakes,
        timeLeft,
        isTyping,
        currentText,
        isLogedIn,
        isMultiplayer,
        gameStarted,
        room,
        rankedPlayers,
        isMobile,
        isPC,
        players,
        setText1,
        setText2,
        setText3,
        setWPM,
        setIsTyping,
        setMistakes,
        setTimeLeft,
        setCurrentText,
        setIsLogedIn,
        setIsMultiplayer,
        setGameStarted,
        setRoom,
        setRankedPlayers,
        setIsMobile,
        setIsPC,
        setPlayers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default ContextProvidor;