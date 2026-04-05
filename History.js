import { useEffect, useState } from 'react';

const History = ({ username }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/get_history/${username}`);
        if (!res.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [username]);

  return (
    <div className="container mt-4 text-white">
      <h3>Your Quiz History</h3>
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <table className="table table-dark table-bordered mt-3">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Score</th>
              <th>Date</th>
              <th>Responses</th>
              <th>Questions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.TOPIC}</td>
                <td>{entry.SCORE}</td>
                <td>{new Date(entry.SUBMITTED_AT).toLocaleString()}</td>
                <td><pre>{entry.RESPONSES}</pre></td>
                <td><pre>{entry.QUESTIONS}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
