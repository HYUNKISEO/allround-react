import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import './home.css'
import {jwtDecode} from "jwt-decode";

const Home = () => {
    const navigate = useNavigate();

    const movePage = () => {
        const token = localStorage.getItem('token')

        if(!token) {
            navigate('/user/login')
        } else {
            navigate('/')
        }

    }
    return (
        <div className='main'>
            <div className='container'>
                <div className='text-container'>
                    <p className='back'>A</p>
                    <p className='front'>문제풀이와 커뮤니티를<br/> 한곳에 담다. AllRound</p>
                </div>
                <button className='custom-button' onClick={() => movePage()}>Let`s Go!</button>
            </div>
        </div>
    );
};

export default Home;