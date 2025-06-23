import "./App.css";
import Manager from "./components/Manager";
import { API_URL } from "./config";
import { useEffect, useContext } from "react";
import toast from "react-hot-toast";
import context from "./context/context";
import axios from "axios";

function App() {
  const { setTextEasy, setTextMedium, setTextHard, setCurrentText, setWidth} =
    useContext(context);
  
  const fetchText = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/text`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setTextEasy(response.data.textEasy);
      setTextMedium(response.data.textMedium);
      setTextHard(response.data.textHard);
      setCurrentText(response.data.textEasy); // Set initial text for typing interface
    } catch (error) {
      console.log(error.message);
      if (error.response) {
        toast.error(error.response.data.message || "Unknown error");
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchText();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-x-hidden">
      <Manager />
    </div>
  );
}

export default App;
