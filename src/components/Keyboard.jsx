import { useState, useEffect ,useContext} from "react";
import context from "../context/context";
const Keyboard = ({inputRef,handleChange}) => {
  const [activeKey, setActiveKey] = useState(null);
  const {isTyping} = useContext(context);
  const keyMap = {
    " ": "Space",
    Enter: "Enter",
    Tab: "Tab",
    Shift:"Shift",
    CapsLock: "Caps Lock",
    Control: "Ctrl",
    Alt: "Alt",
    Backspace: "Backspace",
    ArrowLeft: "Left",
    ArrowRight: "Right",
    ArrowUp: "Up",
    ArrowDown: "Down",
  };

  // Convert key press to match button labels
  const normalizeKey = (key) => keyMap[key] || key.toUpperCase();

  // Handle key press from physical keyboard
  const handleKeyDown = (e) => {
    setActiveKey(normalizeKey(e.key));
  };

  // Remove highlight when key is released
  const handleKeyUp = () => {
    setActiveKey(null);
  };

  useEffect(() => {
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, []);

  // Function to render keyboard rows
  const renderRow = (keys) => {
    return (
      <div className="flex items-center gap-1 justify-center">
        {keys.map((char) => {
          const displayChar = keyMap[char] || char;
          return (
            <button
              key={char}
              className={`border border-black  transition-all text-center flex-1 min-w-[23px] h-7 text-sm overflow-hidden ${
                activeKey === displayChar && isTyping
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => {
                setActiveKey(displayChar);
                setTimeout(() => setActiveKey(null), 300);
              }}
            >
              {displayChar}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center  gap-x-3 gap-y-2 p-3 w-[100%]">
      {renderRow([
        "~",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
      ])}
      {renderRow([
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "\\",
      ])}
      {renderRow([
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
      ])}
      {renderRow([
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",",
        ".",
        "/",
        "Shift",
      ])}
      {renderRow([
        "Ctrl",
        "Fn",
        "Alt",
        "Space",
        "Left",
        "Up",
        "Down",
        "Right",
        "Backspace",
      ])}

      <input
        className="z-[-999] opacity-0 absolute"
        type="text"
        id="textInput"
        ref={inputRef}
        onChange={handleChange}
      />
    </div>
  );
};

export default Keyboard;
