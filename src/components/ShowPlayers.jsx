
const ShowPlayers = ({ players }) => {

  return (
  
      <div className="grid md:grid-cols-2 gird-cols-1 gap-y-4 gap-x-10">
        {players.map((player, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg shadow flex flex-col border-2 border-blue-400"
          >
            <div className="font-medium text-base mb-2 flex  justify-evenly">
              <span>
              Player ID: {player.id}
              </span>
              {player.rank && (
              <span id="rank" className=" text-center rounded-full bg-[#f57c00] w-[25px] border border-black">
              {player.rank}
            </span>
            )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-100 px-2 py-1 rounded text-center">
                {player.wpm !== undefined ? `WPM: ${player.wpm}` : "WPM: -"}
              </div>
              <div className="bg-red-100 px-2 py-1 rounded text-center">
                {player.mistakes !== undefined
                  ? `Mistakes: ${player.mistakes}`
                  : "Mistakes: -"}
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};

export default ShowPlayers;


