import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/users/leaderboard`);
            if (response.data.success) {
                setLeaderboard(response.data.leaderboard);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        // Refresh every 30 seconds for more responsive updates
        const interval = setInterval(fetchLeaderboard, 30000);
        
        // Listen for manual refresh events
        const handleRefresh = () => fetchLeaderboard();
        window.addEventListener('leaderboardRefresh', handleRefresh);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('leaderboardRefresh', handleRefresh);
        };
    }, []);

    if (loading) return <div>Loading leaderboard...</div>;

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg">
            <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 rounded-t-lg">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-200">Global Leaderboard</h2>
                    <button 
                        onClick={fetchLeaderboard}
                        disabled={loading}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>
            
            <div className="p-4">
                {loading && leaderboard.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">Loading leaderboard...</div>
                ) : leaderboard.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No leaderboard data available</div>
                ) : (
                    <div className="space-y-2">
                        {leaderboard.map((entry, index) => (
                            <div key={entry._id} 
                                 className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <span className={`text-xl font-bold ${
                                        index === 0 ? 'text-yellow-400' : 
                                        index === 1 ? 'text-gray-300' : 
                                        index === 2 ? 'text-amber-600' : 'text-gray-400'
                                    }`}>
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-200 font-medium">{entry.name}</span>
                                </div>
                                <div className="flex space-x-4 text-gray-300">
                                    <span className="font-semibold text-indigo-400">{entry.highScore.wpm} WPM</span>
                                    <span className="font-semibold text-emerald-400">{entry.highScore.accuracy}% Accuracy</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;