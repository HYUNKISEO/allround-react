// Login.js
import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigator = useNavigate();

    const handleLogin = () => {
        fetch('http://localhost:8080/api/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 토큰을 사용하거나 저장하려면 이곳에서 처리
                const token = data.token;
                localStorage.setItem('token', token);
                navigator('/')
                window.location.reload();
            })
            .catch(error => {
                alert("로그인 실패")
            });
    };

    return (
        <div className="container d-grid gap-2" style={{width: '100%', height: '100%', marginTop: '25vh', transform: "scale(1.3)"}}>
            <h1 className="mb-3" style={{fontWeight: "bold", color: "green"}}>Login</h1>
            <div className="mb-3 row align-items-center">
                <label htmlFor="username" className="col-sm-2 col-form-label">ID:</label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        className="form-control" // form-control 클래스 추가
                        id="username"
                        placeholder="Enter your ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
            </div>
            <div className="mb-3 row align-items-center">
                <label htmlFor="password" className="col-sm-2 col-form-label">PW:</label>
                <div className="col-sm-10">
                    <input
                        type="password"
                        className="form-control" // form-control 클래스 추가
                        id="password"
                        placeholder="Enter your PW"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className="d-grid gap-2">
                <button type="button" className="btn btn-success btn-block" onClick={handleLogin}>
                       로그인
                </button>
                <button type="button" className="btn btn-success btn-block" onClick={() => navigator("/user/signup")}>
                    회원가입
                </button>
            </div>
        </div>
    );
};

export default Login;
