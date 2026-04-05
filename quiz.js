import React,{useEffect,useState} from 'react';

function Quiz({topic,onLogout}){
    const [questions,setQuestions] = useState([]);
    const [loading,setLoading] = useState(true);
    const [answers,setAnswers] = useState([]);
    const [resultFound,setResultFound] = useState(false);
    const [score,setScore] = useState();

    useEffect(()=>{
        const fetchQuestions = async() =>{
            try{
                const response = await fetch('http://127.0.0.1:5000/get-questions',
                    {
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body: JSON.stringify({topic})
                    });
                const data = await response.json();
                setQuestions(data.questions || []);
            }
            catch(error){ console.error("Failed to fetch questions",error);}
            finally{setLoading(false)};
        };
        fetchQuestions();
    },[topic]);
    
    const handleAnswerSelect = (questionIndex,selectedOption)=>{
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedOption
        }));
    };

    const handleSubmitQuiz = async () => {
        const response = await fetch('http://127.0.0.1:5000/submit-quiz',{
            method:"POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                answers: answers,
                questions:questions
            })
        });
        const result = await response.json();
        setResultFound(true);
        setScore(result.score);
    };
    
    

    if (loading) return <p className='text-white'><center>Loading Questions...</center></p>;

    if(resultFound) return (
        <div>
        <div className="container mt-5">
            <div className="card text-center shadow-lg border-success">
                <div className="card-header bg-success text-white fw-bold fs-4">
                    Quiz Completed
                </div>
                <div className="card-body">
                    <h5 className="card-title">Your Score</h5>
                    <p className="display-4 text-success fw-bold">{score} / {questions.length}</p>
                </div>
            </div>
            <div className="progress my-3">
                <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${(score / questions.length) * 100}%` }}
                    aria-valuenow={score}
                    aria-valuemin="0"
                    aria-valuemax={questions.length}
                >
                    {(score / questions.length) * 100}%
                </div>
            </div>
            <div className="container mt-4">
                    <h3 className="text-success">Quiz Summary</h3>
                {questions.map((q, index) => {
                    const userAnswer = answers[index];
                    const correctAnswer = q.answer;
                    const isCorrect = userAnswer === correctAnswer;
                    return(
                <div key={index} className="card my-3 p-3">
                    <h5 className="fw-bold">Q{index + 1}: {q.question}</h5>
                    <p><strong>Your Answer:</strong> <span className={isCorrect ? "text-success" : "text-danger"}>{userAnswer || "Not Answered"}</span></p>
                    {!isCorrect && (
                    <p><strong>Correct Answer:</strong> <span className="text-success">{correctAnswer}</span></p>
                    )}
                </div>
                    );
                })}
            </div>
        </div>
        </div>
    );

    return(
        <div>
        <div className="container mt-4 text-white">
            <h2 className='mb-4'>Quiz on: {topic}</h2>
            {questions.map((q,idx)=> (
                <div key={idx} className='mb-4 p-3 border border-light rounded'>
                    <p><strong>Q{idx+1}. {q.question}</strong></p>
                    {q.options.map((opt,i)=>(
                        <div key={i} className='mb-2'>
                            <input type="radio" className='form-check-input' name={`question-${idx}`} value={opt} id={`q${idx}--option${i}`} onChange={(e)=> handleAnswerSelect(idx,e.target.value)}/>
                            <label className='form-check-label text-white' htmlFor={`q${idx}--option${i}`}>{opt}</label>
                        
                        </div>
                    ))}
                

                </div>
            ))}
            <div className="text-center mt-4">
                <button className="btn btn-success" onClick={handleSubmitQuiz}>
                    Submit Quiz
                </button>
            </div>
        </div>
        </div>
    );


}
export default Quiz;