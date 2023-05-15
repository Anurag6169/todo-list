import React, { useState } from 'react';
import './Login.css'; 
import { useNavigate } from 'react-router';



const LoginPage = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState(null);

  const history = useNavigate();


  const handleLogin = async () => {

    console.log('Username:', username);
    console.log('Password:', password);

    setError(null);

    const data = {
      email:username,
      password:password
    };
    const url="http://localhost:3100/login";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    const res = await response.json();
    console.log(res);
    if(res.message == "Login successful!"){
      props.setCookie(res.jwt);
      history("/");
    }
  }

  function register(){
    window.location.href = "/register";
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form>
        <div className="input-container">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <label><a onClick={register}>Register?</a></label>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;