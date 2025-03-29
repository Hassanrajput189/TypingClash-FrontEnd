import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import Keyboard from "./Keyboard";
import context from "../context/context";
import toast from "react-hot-toast";
const TypingInterface = () => {
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [mistakes, setMistakes] = useState(0);
  const [WPM, setWPM] = useState(0);
  const [charIndex, setCharIndex] = useState(0);  
  const inputRef = useRef(null);
  const charRef = useRef([]);
  const [correctWrong, setCorrectWrong] = useState([]);
  const { socket, isTyping, setIsTyping, currentText,players, isMultiplayer,isPC, gameStarted ,setGameStarted ,room } = useContext(context);

  useEffect(() => {
    if (currentText && isMultiplayer !== undefined) {
        resetGame();
    }
    socket.on('gameStart',()=>{
      startGame();
    })
}, [currentText, isMultiplayer]);


  useEffect(() => {
    let interval;

    if (isTyping) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(interval);
            setIsTyping(false); // Stop typing when time runs out
            setGameStarted(false);
            return 0;
          }
        });
      }, 1000);
    }

    return () => {

      clearInterval(interval);
    }
  }, [isTyping]); // Timer logic only depends on isTyping

  useEffect(() => {
    if (timeLeft === 0 || charIndex === currentText.length) {
      if(inputRef.current){
        inputRef.current.blur();
      }
      setGameStarted(false);
      setIsTyping(false); // Stop typing when time is up or text is complete
  }
    let wpm;
    const correctChars = charIndex - mistakes;
    const timeElapsed = maxTime - timeLeft;
    if (timeElapsed > 0) {
      wpm = Math.round((correctChars / 5 / timeElapsed) * 60);
      setWPM(wpm > 0 ? wpm : 0);
    }
    socket.emit("updateStats", { wpm, mistakes });
  }, [timeLeft, charIndex,isTyping,gameStarted, socket]);

  const handleChange = (e) => {
    const inputChar = e.target.value; // Get the current character typed
    const inputLength = inputChar.length;

    if (timeLeft > 0 && inputLength > 0) {
      if (!isTyping) {
        setIsTyping(true); // Start the typing timer
      }

      const currentChar = inputChar[inputChar.length - 1]; // Get the last typed character
      const newCorrectWrong = [...correctWrong];

      // Compare the current character with the corresponding character in currentText
      if (currentText[charIndex] === currentChar) {
        newCorrectWrong[charIndex] = "correct";
      } else {
        newCorrectWrong[charIndex] = "wrong";
      }

      const newMistakes = newCorrectWrong.filter(
        (status) => status === "wrong"
      ).length;

      setCharIndex((prevIndex) => prevIndex + 1);
      setMistakes(newMistakes);
      setCorrectWrong(newCorrectWrong);

      // Stop typing when reaching the end of the text
    }

    e.target.value = ""; // Clear the input field after processing
  };

 

  const resetGame = () => {
    setCorrectWrong(Array(currentText.length).fill(""));
    setIsTyping(false);
    setTimeLeft(maxTime);
    setCharIndex(0);
    setMistakes(0);
    setWPM(0);
    setGameStarted(false);
    // Reset charRef
    let charSpan = charRef.current;
    charSpan.forEach(() => {
      charSpan.className = ""; // Remove all classes
    });
    charSpan.className = "border-b-4 border-[#f57c00] ";

    // Clear input field
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  const startGame = () => {
    if (isMultiplayer &&  players.length === 0) {
      toast.error("You must be in a multiplayer room to start the game.");
      
    }
    else if (isMultiplayer  && players.length < 2 && players.length >= 1) {
      toast.error("There should be a minimum of 2 players in the room.");
      
    }
    else {
      if(timeLeft !== 0 || charIndex !== 0  || charIndex  <= currentText.length){
        resetGame();
      }
      setGameStarted(true);
      inputRef.current.focus();
      toast.success("Game started!");
    }
    
    
  };

  return (
    <div className="border-4 border-blue-400 flex flex-col justify-between shadow-2xl  md:w-[60vw] w-[95vw]  h-[50vh]  rounded-2xl  font-bold overflow-hidden pb-4">
      <div className="p-4">
        <p
          id="textPara"
          className=" h-40 overflow-hidden select-none md:text-2xl sm:text-xl text-lg "
        >
          {currentText.split("").map((char, index) => (
            <span
              key={index}
              className={`${
                index === charIndex ? "border-b-4 border-[#f57c00]" : ""
              } ${correctWrong[index]}`}
              ref={(e) => (charRef.current[index] = e)}
            >
              {char}
            </span>
          ))}
          
        </p>

        <div id="keyboard" className="flex flex-col items-center">
          {isPC && ( 
            <Keyboard inputRef={inputRef} handleChange={handleChange}/>
          )}
        </div> 
        

      </div>
      <div className="flex justify-around items-center  md:text-lg text-sm  ">
          <p>
            Time Left: <strong>{timeLeft}</strong>
          </p>
          <p>
            Mistakes: <strong>{mistakes}</strong>
          </p>
          <p>
            WPM: <strong>{WPM}</strong>
          </p>


          <button
            id="button"
            className=" w-fit h-fit bg-[#f57c00] text-black hover:text-white rounded-full  border-2 border-black px-2 py-1 hover:bg-[#1976d2] text-sm font-semibold transition-transform duration-300 transform  hover:scale-105 hover:border-[#00000080]"
            onClick={()=>{
              socket.emit("startGame");
            }}
          >
            Start
          </button>
          {room && !gameStarted &&(
            <button className="w-fit h-fit text-sm bg-[#fc8124] border border-black rounded-full text-black px-2  py-1 font-semibold transition-transform duration-300 transform hover:bg-[#ffad5c] hover:scale-105"
            onClick={()=>{
              socket.emit("checkWinner",room);
            }}>
            Check Winner
            </button>
      )}
        </div>
    </div>
  );
};

export default TypingInterface;
