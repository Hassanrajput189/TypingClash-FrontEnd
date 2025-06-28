import { useContext,useEffect,useState } from "react";
import context from "../context/context";

const Progress = ({progress}) => {
  const {currentText} = useContext(context);
  const [progressPercentage, setProgressPercentage] = useState(0);
  useEffect(() => {
    if (currentText.length > 0) {
      const percentage = Math.floor((progress / currentText.length) * 100);
      setProgressPercentage(percentage);
    }
  }, [progress, currentText]);
  
  return (
      <div className="text-md text-gray-200 font-bold">
        {progressPercentage}
        <span className="text-sm">%</span>
      </div>
  );
};

export default Progress;
