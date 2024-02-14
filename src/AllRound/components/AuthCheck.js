import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({children}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            // 토큰이 없으면 로그인 페이지로 이동
            navigate('/user/login');
        } else {
            try {

            } catch (error) {
                // 토큰 디코딩 실패 또는 유효하지 않은 토큰일 경우
                console.error('Invalid token');
                // 로그인 페이지로 이동
                navigate('/user/login');
            }
        }
    }, [navigate]);

    return <div>{children}</div>;
};

export default AuthCheck;
