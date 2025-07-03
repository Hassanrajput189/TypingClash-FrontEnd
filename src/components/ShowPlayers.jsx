import { useContext } from "react";
import context from "../context/context";

const ShowPlayers = ({ players }) => {
  const { width } = useContext(context);
  return (
    <div className="space-y-4 h-[180px]">
      <h3 className="text-xl font-semibold text-gray-200 mb-4">
        Players in Room
      </h3>
      {players.length !== 0 ? (
        <div className="grid md:grid-cols-2 gap-4 overflow-x-hidden">
          {players.map((player, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg shadow-sm border border-gray-600 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>

                  <span className="font-medium text-gray-200">
                    {player.userName ? player.userName : `Player ${index + 1}`}
                  </span>
                </div>

                
                  <div className=" flex justify-center items-center">
                    
                    {player.percentage}
                  </div>
                
                <span className="text-sm text-gray-400">ID: {player.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-sm text-indigo-400 font-medium">WPM</div>
                  <div className="text-lg font-bold text-indigo-300">
                    {player.wpm !== undefined ? player.wpm : "-"}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-sm text-rose-400 font-medium">
                    Mistakes
                  </div>
                  <div className="text-lg font-bold text-rose-300">
                    {player.mistakes !== undefined ? player.mistakes : "-"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center">
          No players in the room yet.
        </div>
      )}
    </div>
  );
};

export default ShowPlayers;
