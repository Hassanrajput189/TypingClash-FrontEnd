import { useState, useMemo, useEffect } from "react";
import io from "socket.io-client";
import UserContext from "./context";
import toast from "react-hot-toast";

const ContextProvidor = ({ children }) => {
  const socket = useMemo(() => {
    return io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000", { 
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true
    });
  }, []); 

  // Socket connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setIsConnecting(false);
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Connection error. Trying to reconnect...');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error(error.message || 'An error occurred');
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
      toast.success('Reconnected successfully');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('error');
      socket.off('reconnect');
    };
  }, [socket]);

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
  const [rankedPlayers, setRankedPlayers] = useState([]);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPC, setIsPC] = useState(false);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Detect device type
  useEffect(() => {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
    setIsPC(!isMobileDevice);
  }, []);

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
        isLoading,
        isConnected,
        isConnecting,
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
        setIsLoading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default ContextProvidor;
