import React, { useEffect, useContext, useState } from "react";
import context from "../context/context";
import toast from "react-hot-toast";

const MultiplayerInterface = () => {
  const { socket, room, setRoom, setPlayers, gameStarted, setRankedPlayers } =
    useContext(context);
    const [socketId, setSocketId]= useState(socket.id);
    useEffect(() => {
      socket.on("connect", () => {
          setSocketId(socket.id);
      });
  }, [socket]);
  
  useEffect(() => {
    // Listen for updates to the player list
    socket.on("playerList", (playerList) => {
      if (playerList.length <= 4) {
        setPlayers(playerList);
      } else {
        toast.error("The room is full! Please try joining another room.");
      }
    });
    
    socket.on('message',(message)=>{
      toast.success(message)
    })
    socket.on("ranking", (rankedPlayers) => {   
      setRankedPlayers(rankedPlayers);
  });
  
    // Listen for player stats updates
    socket.on("playerStats", (stats) => {
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player) =>
          player.id === stats.id ? { ...player, ...stats } : player
        );
      });
    });

    // Clean up the event listeners when the component unmounts
    return () => {
      socket.off("playerList");
      socket.off("playerStats");
      socket.off("ranking");
      socket.off("message");
    };
  }, [socket]);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!room.trim()) {
        toast.error("Room name cannot be empty.");
        return;
    }
    socket.emit("joinRoom", { room, message: `${socketId} joined room ${room}` });
  };  

  return (
    <div className="bg-gray-100 border-2 border-blue-400 flex flex-col items-center justify-center gap-1 rounded-2xl p-4 w-[350px]">
      <div className="font-semibold">Your ID: {socketId}</div>
      {!gameStarted && (
        <form onSubmit={handleJoinRoom}>
          <div className="flex gap-2">
            <div>
              <input
                className="border-2 border-black rounded-md"
                type="text"
                placeholder="Room name"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            <div className="bg-green-500 rounded-md text-sm border border-black py-1 px-2">
              <button type="submit">Join Room</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default MultiplayerInterface;





