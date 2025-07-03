import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import context from "../context/context";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import axios from "axios";
const TypingInterface = () => {
  // State variables
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const inputRef = useRef(null);
  const charRef = useRef([]);
  const [correctWrong, setCorrectWrong] = useState([]);

  const {
    socket,
    room,
    currentText,
    players,
    isMultiplayer,
    isTyping,
    setIsTyping,
    setLeftRoom,
    charIndex,
    setCharIndex,
    setWPM,
    setMistakes,
    setPercentage,
  } = useContext(context);
  useEffect(() => {
    if (currentText && isMultiplayer !== undefined) {
      resetGame();
    }
  }, [currentText, isMultiplayer]);

  useEffect(() => {
    if (inputRef.current) {
      if (isTyping) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [isTyping]);

  useEffect(() => {
    let interval;

    if (isTyping) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(interval);
            setIsTyping(false);
            toast.error("Time's up!"); //
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isTyping]);

  const handleStats = async (e, correctWrong) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/api/users/stats`,
        {
          correctWrong,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const { wpm, mistakes, percentage } = response.data;
        setWPM(wpm);
        setMistakes(mistakes);
        setPercentage(percentage);
        toast.success("Stats calculated successfully!");
      }
    } catch (error) {
      
      if (error.response) {
        toast.error(error.message || "Unknown error");
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    if (isTyping) {
      const newCorrectWrong = [...correctWrong];
      if (charIndex + 1 === currentText.length) {
        toast.success("Text completed!");
        setIsTyping(false);
        if (isMultiplayer) {
          socket.emit("calStats", newCorrectWrong);
        } else {
          handleStats(e, newCorrectWrong);
        }
        return;
      }
      const inputChar = e.target.value;
      const inputLength = inputChar.length;

      if (timeLeft > 0 && inputLength > 0) {
        if (!isTyping) {
          setIsTyping(true);
        }
        const currentChar = inputChar[inputChar.length - 1];

        if (currentText[charIndex] === currentChar) {
          newCorrectWrong[charIndex] = "correct";
        } else {
          newCorrectWrong[charIndex] = "wrong";
        }
        setCorrectWrong(newCorrectWrong);
        setCharIndex((prevIndex) => prevIndex + 1);
      }

      e.target.value = "";
    }
  };

  const resetGame = () => {
    setCorrectWrong(Array(currentText.length).fill(""));
    setIsTyping(false);
    setTimeLeft(maxTime);
    setCharIndex(0);
    setMistakes(0);
    setWPM(0);
    let charSpan = charRef.current;
    charSpan.forEach(() => {
      charSpan.className = "";
    });
    charSpan.className = "border-b-4 border-indigo-500";

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const startGame = () => {
    if (isMultiplayer && players.length === 0) {
      toast.error("You must be in a multiplayer room to start the game.");
    } else if (isMultiplayer && players.length < 2 && players.length >= 1) {
      toast.error("There should be a minimum of 2 players in the room.");
    } else {
      resetGame();
      if (isMultiplayer) {
        socket.emit("startGame");
      } else {
        setIsTyping(true);
        toast.success("Game started!");
      }
    }
  };

  return (
    <div className="w-full relative">
      {/* Main Container */}
      <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50">
        {/* Typing Area */}
        <div className="relative pb-8 pl-8 pr-8">
          {/* Control Button */}
          <div className=" flex justify-between items-center ">
            <div className="  px-2 transition-all duration-200 transform hover:scale-105 ">
              <button id="button" onClick={startGame}>
                <span className="text-md text-indigo-400 font-medium">
                  {isTyping && !isMultiplayer ? "Try Again" : "Start"}
                </span>
              </button>
            </div>
            {isMultiplayer && players.length > 1 && (
              <div className=" px-2 transition-all duration-200 transform hover:scale-105 ">
                <div className="text-md text-indigo-400 font-medium">
                  <button
                    onClick={() => {
                      socket.emit("leaveRoom", room);
                      setLeftRoom(true);
                    }}
                  >
                    Leave Room
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-center items-center gap-2  px-2  transition-all duration-200 transform hover:scale-105 ">
              <div className="text-sm text-indigo-400 font-medium">
                Time Left
              </div>
              <div className="text-xl font-bold text-indigo-300">
                {timeLeft}s
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <p
                id="textPara"
                className="min-h-[180px] overflow-hidden select-none text-2xl leading-relaxed text-gray-300 font-mono "
              >
                {currentText.split("").map((char, index) => (
                  <span
                    key={index}
                    className={`${
                      index === charIndex
                        ? "border-b-4 border-indigo-500 bg-indigo-500/10 rounded-sm"
                        : ""
                    } ${
                      correctWrong[index] === "correct"
                        ? "text-emerald-400"
                        : correctWrong[index] === "wrong"
                        ? "text-rose-400"
                        : "text-gray-300"
                    }`}
                    ref={(e) => (charRef.current[index] = e)}
                  >
                    {char}
                  </span>
                ))}
              </p>
              <input
                className="absolute inset-0 w-full h-full  cursor-text opacity-0"
                type="text"
                id="textInput"
                ref={inputRef}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingInterface;
