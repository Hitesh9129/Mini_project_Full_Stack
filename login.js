import { useState } from 'react';

function Login({onLoginSuccess}){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [errorMsg,setErrorMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const res = await fetch('http://127.0.0.1:5000/login',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({username,password})
        });
        const data = await res.json();
        
        if(data.success){
            onLoginSuccess(username);
        }
        else{
            setErrorMsg(data.message || 'Login failed');
        }
    };
    const handleSignUp = async (e) => {
        e.preventDefault();
        
        const res = await fetch('http://127.0.0.1:5000/signup',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({username,password})
        });
        const data = await res.json();
        alert(data.message);
    };

    return (
        <div>
        <h2 className="text-center text-black py-3 w-100 m-0" >Login</h2>
        <div className="w-100 d-flex justify-content-center mt-4">
            <form className="w-75 w-md-50">
                <div className="mb-3">
                    <label className="form-label">Username: </label>
                    <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password: </label>
                    <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required/>
                </div>
                {errorMsg && <p className="text-danger">{errorMsg}</p>}
                <button className="btn btn-primary" onClick={handleLogin}>Login</button><t> </t>
                <button className="btn btn-primary" onClick={handleSignUp}>signup</button>
            </form>

        </div>
        </div>
    );
}
export default Login;