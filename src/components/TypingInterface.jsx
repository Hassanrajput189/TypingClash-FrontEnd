import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import context from "../context/context";
import toast from "react-hot-toast";
import Progress from "./Progress";
const TypingInterface = () => {
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [mistakes, setMistakes] = useState(0);
  const [WPM, setWPM] = useState(0);
  const inputRef = useRef(null);
  const charRef = useRef([]);
  const [correctWrong, setCorrectWrong] = useState([]);
  const [charIndex, setCharIndex] = useState(0);
  const {
    socket,
    room,
    currentText,
    players,
    progress,
    setProgress,
    isMultiplayer,
    isTyping,
    setIsTyping,
    setLeftRoom,
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
            toast.error("Time's up!");//
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isTyping]);

  useEffect(() => {
    let wpm;
    const correctChars = charIndex - mistakes;
    const timeElapsed = maxTime - timeLeft;
    if (timeElapsed > 0) {
      wpm = Math.round((correctChars / 5 / timeElapsed) * 60);
      setWPM(wpm > 0 ? wpm : 0);
    }
    if (isTyping === true && wpm && mistakes && progress !== undefined) {
      socket.emit("updateStats", { wpm, mistakes, progress });
    }
  }, [
    timeLeft,
    charIndex,
    socket,
    isMultiplayer,
    currentText,
    mistakes,
    inputRef,
  ]);

  const handleChange = (e) => {
    if (isTyping) {
      if (charIndex + 1 === currentText.length) {
        toast.success("Text completed!");
        setIsTyping(false);
        return;
      }
      const inputChar = e.target.value;
      const inputLength = inputChar.length;

      if (timeLeft > 0 && inputLength > 0) {
        if (!isTyping) {
          setIsTyping(true);
        }

        const currentChar = inputChar[inputChar.length - 1];
        const newCorrectWrong = [...correctWrong];

        if (currentText[charIndex] === currentChar) {
          newCorrectWrong[charIndex] = "correct";
          setProgress((prevProgress) => prevProgress + 1);
        } else {
          newCorrectWrong[charIndex] = "wrong";
        }

        const newMistakes = newCorrectWrong.filter(
          (status) => status === "wrong"
        ).length;

        setCharIndex((prevIndex) => prevIndex + 1);

        setMistakes(newMistakes);
        setCorrectWrong(newCorrectWrong);

        if (charIndex + 1 === currentText.length) {
          setIsTyping(false);
        }
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
    setProgress(0);
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
      if(isMultiplayer){
          socket.emit("startGame");
        }
      else{
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
        <div className="relative p-8">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 via-transparent to-gray-800/50 pointer-events-none"></div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur opacity-30"></div>
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

        {/* Stats Display */}
        <div className="relative px-8 pb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/90 to-gray-800/70 border-t border-gray-700/50"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                <div className="text-sm text-indigo-400 font-medium mb-1">
                  Time Left
                </div>
                <div className="text-3xl font-bold text-indigo-300">
                  {timeLeft}s
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-rose-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                <div className="text-sm text-rose-400 font-medium mb-1">
                  Mistakes
                </div>
                <div className="text-3xl font-bold text-rose-300">
                  {mistakes}
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                <div className="text-sm text-emerald-400 font-medium mb-1">
                  WPM
                </div>
                <div className="text-3xl font-bold text-emerald-300">{WPM}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Button */}
        <div className="p-6 flex justify-evenly items-center gap-10">
          <div className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/20">
            <button id="button" onClick={startGame}>
              <span className="relative z-10">
                {isTyping && !isMultiplayer ? "Try Again" : "Start"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </div>
          {!isMultiplayer && (
            <div className="flex flex-col items-center px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/20">
              <div className="text-xs">Completed</div>
              <Progress progress={progress} />
            </div>
          )}
          {isMultiplayer && players.length > 1 && (
            <div className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/20">
              <button onClick={()=>{
                socket.emit("leaveRoom", room)
                setLeftRoom(true);
              }}>
                Leave Room
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingInterface;
