import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const AuthCheck = ({children}) => {
    const navigate = useNavigate();

    const checkToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // 토큰이 없으면 로그인 페이지로 이동
            navigate('/user/login');
        } else {
            try {
                const decodedToken = jwtDecode(token);
                const now = Date.now() / 1000; // 현재 시간 (초 단위)

                if (decodedToken.exp < now) {
                    // 토큰이 만료된 경우 로그아웃 처리
                    console.error('Token has expired');
                    localStorage.removeItem('token'); // 토큰 제거
                    window.location.reload();
                    navigate('/user/login'); // 로그인 페이지로 이동
                }
                const remainingTime = decodedToken.exp - now;
                const minute = Math.floor(remainingTime / 60); // 분
                const seconds = remainingTime % 60; // 초
                const formattedSeconds = seconds.toFixed(0);
                if (remainingTime <= 600 && remainingTime > 0) {
                    // 로그아웃까지 10분 이하일 때
                    const extendLogout = window.confirm(`로그아웃 까지 ${minute}분 ${formattedSeconds}초 남았습니다. 연장하시겠습니까?`);
                    if (extendLogout && decodedToken.exp > now) {
                        fetch('http://localhost:8080/api/refresh-token', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json',
                            },
                        })
                            .then(response => response.json())
                            .then(data => {
                                const newToken = data.token;
                                localStorage.removeItem('token')
                                localStorage.setItem('token', newToken)
                                window.location.reload();
                            })
                            .catch(error => {
                                console.error('토큰 갱신 실패:', error);
                            });
                    }else {
                        // 사용자가 연장하지 않을 경우 로그아웃 처리
                        localStorage.removeItem('token'); // 토큰 제거
                        navigate('/user/login'); // 로그인 페이지로 이동
                    }
                }
            } catch (error) {
                // 토큰 디코딩 실패 또는 유효하지 않은 토큰일 경우
                console.error('Invalid token');
                // 로그인 페이지로 이동
                navigate('/user/login');
            }
        }
    }

    useEffect(() => {
        // 초기 렌더링 시 데이터 불러오기
        checkToken();

        const intervalId = setInterval(() => {
            checkToken();
        }, 300000);

        // 컴포넌트가 언마운트되면 clearInterval로 인터벌 제거
        return () => clearInterval(intervalId);
    }, [navigate]);

    return <div>{children}</div>;
};

export default AuthCheck;
