import { useState, useMemo, useEffect } from "react";
import io from "socket.io-client";
import UserContext from "./context";
import { API_URL } from "../config";
import toast from "react-hot-toast";

const ContextProvidor = ({ children }) => {
  const socket = useMemo(() => {
    return io(API_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
  }, []);

  const maxTime = 60;
  const [socketID, setSocketID] = useState(socket.id);
  const [dbID,setDBID] = useState("");
  const [mistakes, setMistakes] = useState(0);
  const [WPM, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [textEasy, setTextEasy] = useState("");
  const [textMedium, setTextMedium] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [textHard, setTextHard] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [room, setRoom] = useState("");
  const [roomHistory, setRoomHistory] = useState([]);
  const [leftRoom,setLeftRoom] = useState(false);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [showMultiInput, setShowMultiInput] = useState(false);
  const [showMultiRooms, setShowMultiRooms] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [players, setPlayers] = useState([]);
  const [userName, setUserName] = useState("");
  const [width, setWidth] = useState(window.innerWidth);


  
  // Handle socket connect
  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => setSocketID(socket.id);
    socket.on("connect", handleConnect);
    return () => socket.off("connect", handleConnect);
  }, [socket]);

  // Handle playerList
  useEffect(() => {
    if (!socket) return;
    const handlePlayerList = (playerList) => {
      if (playerList.length <= 4) {
        setPlayers(playerList);
      } else {
        toast.error("The room is full! Please try joining another room.");
      }
      // Reset players if left room
      if (leftRoom) {
        setPlayers([]);
        setLeftRoom(false);
      }
    };
    socket.on("playerList", handlePlayerList);
    return () => socket.off("playerList", handlePlayerList);
  }, [socket, leftRoom]);

  // Handle roomList
  useEffect(() => {
    if (!socket) return;
    socket.emit("getRooms");
    const handleRoomList = (rooms) => setRoomHistory(rooms);
    socket.on("roomList", handleRoomList);
    return () => socket.off("roomList", handleRoomList);
  }, [socket,leftRoom,room]);

  // Handle playerStats
  useEffect(() => {
    if (!socket) return;
    const handlePlayerStats = (stats) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === stats.id ? { ...player, ...stats } : player
        )
      );
      // Trigger leaderboard refresh when stats are received
      window.dispatchEvent(new CustomEvent('leaderboardRefresh'));
    };
    socket.on("playerStats", handlePlayerStats);
    return () => socket.off("playerStats", handlePlayerStats);
  }, [socket]);

  // Handle playerProgress
  useEffect(() => {
    if (!socket) return;
    const handlePlayerProgress = (progress) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === progress.id ? { ...player, charIndex: progress.charIndex } : player
        )
      );
    };
    socket.on("playerProgress", handlePlayerProgress);
    return () => socket.off("playerProgress", handlePlayerProgress);
  }, [socket]);

  // Handle message
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (message) => toast.success(message);
    socket.on("message", handleMessage);
    return () => socket.off("message", handleMessage);
  }, [socket]);

  // Handle gameStart
  useEffect(() => {
    if (!socket) return;
    const handleGameStart = () => setIsTyping(true);
    socket.on("gameStart", handleGameStart);
    return () => socket.off("gameStart", handleGameStart);
  }, [socket]);

  return (
    <UserContext.Provider
      value={{
        socket,
        socketID,
        dbID,
        maxTime,
        textEasy,
        textMedium,
        textHard,
        WPM,
        mistakes,
        accuracy,
        charIndex,
        timeLeft,
        currentText,
        isLogedIn,
        isMultiplayer,
        showMultiInput,
        showMultiRooms,
        isTyping,
        room,
        roomHistory,
        leftRoom,
        players,
        userName,
        width,
        setSocketID,
        setDBID,
        setTextEasy,
        setTextMedium,
        setTextHard,
        setWPM,
        setMistakes,
        setAccuracy,
        setCharIndex,
        setTimeLeft,
        setCurrentText,
        setIsLogedIn,
        setIsMultiplayer,
        setShowMultiInput,
        setShowMultiRooms,
        setIsTyping,
        setRoom,
        setRoomHistory,
        setLeftRoom,
        setPlayers,
        setUserName,
        setWidth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default ContextProvidor;
