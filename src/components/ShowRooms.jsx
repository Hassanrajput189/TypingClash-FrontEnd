import { useEffect, useContext } from 'react'
import context from '../context/context'

const ShowRooms = () => {
  const { roomHistory } = useContext(context);

  
  return (
    <div className='bg-gray-800  rounded-xl shadow-lg p-6 border border-gray-700 overflow-y-auto '>
      <h2 className="text-2xl font-bold text-white mb-4 ">Available Rooms</h2>
      <div className=" rounded-lg flex flex-col gap-2 w-[90%]">
        {roomHistory && roomHistory.length > 0 ? (
          <ul>
            {roomHistory.map(room => (
              <li key={room.name} className='text-gray-300 p-2 border-b border-gray-700 hover:bg-gray-700 cursor-pointer'>
                {room.name} - {room.count}/4 players
              </li>
            ))}
          </ul>
        ) : (
          <div className='text-gray-300 p-2'>
            No rooms available
          </div>
        )}
      </div>
    </div>
  )
}

export default ShowRooms