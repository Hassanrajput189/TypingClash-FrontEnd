import {  useContext, useState,useRef, useEffect } from "react";
import context from "../context/context";
import toast from "react-hot-toast";


const MultiplayerInput = () => {
  const [roomInput, setRoomInput] = useState("");
  const roomInputRef = useRef(null);
  const { socket, userName, room, setRoom, socketID ,isTyping} =
    useContext(context);

    
    const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!room.trim()) {
      toast.error("Room name cannot be empty.");
      return;
    }

  
    socket.emit("joinRoom", {
      room,
      message: `${userName} joined room ${room}`,
      userName,
    });
    roomInputRef.current.value = "";
  };

  
  

  return (

    <div className=" bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 ">
      <div className="space-y-3">
        {/* Player ID Display */}
        <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
          <span className="text-sm font-medium text-gray-300">Your ID:</span>
          <span className="font-mono text-xs text-indigo-400">{socketID}</span>
        </div>

        {/* Game Controls */}
        <div className="flex flex-col justify-center items-center gap-3">
          

          {!isTyping && (
            <form
              onSubmit={handleJoinRoom}
              className="flex flex-col justify-center items-center gap-3"
            >
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter room name"
                  ref={roomInputRef}
                  onChange={(e) => {
                    e.preventDefault();
                    setRoomInput(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                onClick={()=>{
                  setRoom(roomInput.trim());
                }}
              >
                Join Room
              </button>
            </form>
          )}
        </div>
      </div>
      
    </div>

  );
};

export default MultiplayerInput;
