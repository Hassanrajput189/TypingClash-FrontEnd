import { useContext } from "react";
import context from "../context/context";
const ShowStats = () => {
  const { WPM, mistakes, accuracy } = useContext(context);
  return (
     <div className="relative px-8 py-6 w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/90 to-gray-800/70 border-t border-gray-700/50 rounded-3xl"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                <div className="text-sm text-indigo-400 font-medium mb-1">
                  Accuracy
                </div>
                <div className="text-3xl font-bold text-indigo-300">
                  {accuracy}
                  <span className="text-[20px]">%</span>
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
                  {mistakes?mistakes:0}
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
                <div className="text-sm text-emerald-400 font-medium mb-1">
                  WPM
                </div>
                <div className="text-3xl font-bold text-emerald-300">{WPM?WPM:0}</div>
              </div>
            </div> 
         </div>
        </div> 
  );
};

export default ShowStats;
