import { useContext } from "react";
import context from "../context/context";

const ShowPlayers = ({ players }) => {
  const { charIndex, currentText, isTyping } = useContext(context);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-200 mb-4">
        Players in Room ({players.length})
      </h3>
      {players.length !== 0 ? (
        <div className="grid md:grid-cols-2 gap-4 overflow-x-hidden">
          {players.map((player, index) => (
            <div
              key={player.id || index}
              className="bg-gray-700 rounded-lg shadow-sm border border-gray-600 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isTyping ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                  }`}></div>
                  <span className="font-medium text-gray-200">
                    {player.userName ? player.userName : `Player ${index + 1}`}
                  </span>
                </div>
                
                <span className="text-sm text-gray-400">ID: {player.id}</span>
              </div>

              {/* Show progress during game */}
              {isTyping && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{player.charIndex || 0}/{currentText.length}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((player.charIndex || 0) / currentText.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Show stats after game completion */}
              {charIndex === currentText.length && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-indigo-400 font-medium">WPM</div>
                    <div className="text-lg font-bold text-indigo-300">
                      {player.wpm !== undefined ? player.wpm : "-"}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-emerald-400 font-medium">Accuracy</div>
                    <div className="text-lg font-bold text-emerald-300">
                      {player.accuracy !== undefined ? `${player.accuracy}%` : "-"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-8">
          No players in the room yet.
        </div>
      )}
    </div>
  );
};

export default ShowPlayers;
