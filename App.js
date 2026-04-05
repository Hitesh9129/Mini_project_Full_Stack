import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Quiz from './quiz.js';
import Login from './login.js'
import History from './History.js';

function App() {
  const [loggedInUser,setLogedInUser] = useState(null);
  const [topic , setTopic] = useState('')
  const [startQuiz,setStartQuiz] = useState(false);
  const [showHistory, setShowHistory] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();  
    if(topic.trim() !== ''){
      setStartQuiz(true);
    }
  };
  
  const handleLoginSuccess = (username) => {
    setLogedInUser(username);
  }

  const handleLogout = () =>{
    setLogedInUser(null);
  }

  const handleHome = () => {
    setStartQuiz(false); 
    setShowHistory(false);
    setTopic('');
  };
  
  const handleHistory = () => {
    setShowHistory(true);
    setStartQuiz(false);
  };

  if(!loggedInUser) return <Login onLoginSuccess={handleLoginSuccess} />

  return (
    <div className='bg-dark' style={{ minHeight: '100vh' }}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100 px-4">
        <div className="navbar-collapse w-100 d-flex justify-content-between align-items-center">
            <div>
            <button className="btn btn-outline-light btn-sm" onClick={handleHome}>
                Home
                </button>
                </div>
                <div>
                  <button className="btn btn-outline-light btn-sm" onClick={handleHistory}>History</button>
                </div>
            <div>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
                </button>
            </div>
            </div>
            </nav>
      <h1 className="text-center text-white py-3 bg-info w-100 m-0">WELCOME TO OUR QUIZ</h1>
      
    {showHistory ? (<History username={loggedInUser} />) : startQuiz ? (<Quiz topic={topic} onLogout={handleLogout} username={loggedInUser} />) : (
      
      <div className="w-100 d-flex justify-content-center mt-4">
        <form className="w-75 w-md-50" onSubmit={handleSubmit}>
      <label htmlFor="topic" className="form-label text-white">
        Enter Topic (e.g., General Knowledge, History, Programming)
      </label>
      <input
        type="text"
        id="topic"
        className="form-control"
        placeholder="Enter topic here"
        onChange={(e) => setTopic(e.target.value)}
      />
      <div className="d-flex justify-content-center mt-3">
        <button type="submit" className="btn btn-primary">
          Start Quiz
        </button>
      </div>
      </form>

      </div>
    )
    }

    </div>
  );
}

export default App;
